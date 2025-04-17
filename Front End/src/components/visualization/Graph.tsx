import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Node } from './types';
import { GraphContainer } from './StyledComponents';
import GraphCanvas from './GraphCanvas';
import NodeComponent from './NodeComponent';
import { Box, Typography } from '@mui/material';

interface GraphProps {
  nodes: Node[];
  currentConceptIndex: number;
  updateNodePositions: (nodes: Node[]) => void;
}

const Graph = ({ nodes, currentConceptIndex, updateNodePositions }: GraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationOffset, setAnimationOffset] = useState(0);
  const [nodePositions, setNodePositions] = useState<Map<number, { x: number, y: number }>>(new Map());

  // Initialize node positions when nodes change
  useEffect(() => {
    if (nodes.length === 0) {
      setNodePositions(new Map());
      return;
    }

    // Generate initial positions in a circular layout
    const newPositions = new Map<number, { x: number, y: number }>();
    const centerX = 0.5; // Center of container
    const centerY = 0.5;
    const radius = 0.3; // Radius for the circle

    nodes.forEach((node, index) => {
      // If node already has a position, keep it
      if (nodePositions.has(node.id)) {
        newPositions.set(node.id, nodePositions.get(node.id)!);
        return;
      }
      
      // Otherwise calculate a position
      const angle = (index / nodes.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Add slight randomization to avoid perfect circle
      const jitter = 0.05;
      const randomX = x + (Math.random() - 0.5) * jitter;
      const randomY = y + (Math.random() - 0.5) * jitter;
      
      // Ensure within bounds
      const boundedX = Math.min(Math.max(randomX, 0.15), 0.85);
      const boundedY = Math.min(Math.max(randomY, 0.15), 0.85);
      
      newPositions.set(node.id, { x: boundedX, y: boundedY });
    });
    
    setNodePositions(newPositions);
  }, [nodes]);

  // Handle node drag start
  const handleMouseDown = (event: MouseEvent, nodeId: number) => {
    event.preventDefault();
    
    // Find node and container
    const node = nodes.find(n => n.id === nodeId);
    const position = nodePositions.get(nodeId);
    const container = containerRef.current;
    
    if (node && position && container) {
      // Calculate offset from cursor to node center
      const containerRect = container.getBoundingClientRect();
      const nodeX = position.x * containerRect.width;
      const nodeY = position.y * containerRect.height;
      
      const offsetX = event.clientX - (containerRect.left + nodeX);
      const offsetY = event.clientY - (containerRect.top + nodeY);
      
      setDraggedNode(nodeId);
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };
  
  // Handle node dragging
  const handleMouseMove = (event: MouseEvent) => {
    if (draggedNode === null) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    // Calculate new position in normalized coordinates (0-1)
    const newX = (event.clientX - containerRect.left - dragOffset.x) / containerRect.width;
    const newY = (event.clientY - containerRect.top - dragOffset.y) / containerRect.height;
    
    // Boundary margin in normalized coordinates
    const boundaryMargin = 0.15;
    
    // Keep node within bounds (with some padding)
    const boundedX = Math.min(Math.max(newX, boundaryMargin), 1 - boundaryMargin);
    const boundedY = Math.min(Math.max(newY, boundaryMargin), 1 - boundaryMargin);
    
    // Update the node position
    const newPositions = new Map(nodePositions);
    newPositions.set(draggedNode, { x: boundedX, y: boundedY });
    setNodePositions(newPositions);
  };
  
  // Handle node drag end
  const handleMouseUp = () => {
    if (draggedNode !== null) {
      setDraggedNode(null);
      
      // Optional: save final positions to some state or send to backend
      // For example, we could save positions to localStorage
    }
  };

  // Animate connections
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Update animation offset for flowing dashes
      setAnimationOffset(prev => (prev + deltaTime * 0.02) % 20);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update container dimensions and handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerDimensions({ width, height });
      }
    };
    
    updateDimensions();
    
    const observer = new ResizeObserver(updateDimensions);
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentConceptIndex, draggedNode]);

  // Display empty state when there are no nodes
  if (nodes.length === 0) {
    return (
      <GraphContainer ref={containerRef}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            textAlign: 'center',
            p: 3
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            No concept map available yet
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            As Alex learns, a visual representation of this concept will appear here.
          </Typography>
        </Box>
      </GraphContainer>
    );
  }

  return (
    <GraphContainer ref={containerRef}>
      <GraphCanvas
        nodes={nodes}
        containerWidth={containerDimensions.width}
        containerHeight={containerDimensions.height}
        hoveredNode={hoveredNode}
        draggedNode={draggedNode}
        animationOffset={animationOffset}
        nodePositions={nodePositions}
      />
      
      {nodes.map(node => {
        const position = nodePositions.get(node.id) || { x: 0.5, y: 0.5 };
        return (
          <NodeComponent
            key={node.id}
            node={node}
            position={position}
            isDragging={draggedNode === node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
          />
        );
      })}
    </GraphContainer>
  );
};

export default Graph; 