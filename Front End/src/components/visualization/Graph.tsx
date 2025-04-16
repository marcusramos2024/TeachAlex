import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Node } from './types';
import { GraphContainer } from './StyledComponents';
import GraphCanvas from './GraphCanvas';
import NodeComponent from './NodeComponent';
import { resolveOverlap } from './graphUtils';
import { Box, Typography } from '@mui/material';

interface GraphProps {
  nodes: Node[];
  connections: { source: number; target: number }[];
  currentConceptIndex: number;
  updateNodePositions: (nodes: Node[]) => void;
}

const Graph = ({ nodes, connections, currentConceptIndex, updateNodePositions }: GraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [animationOffset, setAnimationOffset] = useState(0);

  // Handle node drag start
  const handleMouseDown = (event: MouseEvent, nodeId: number) => {
    event.preventDefault();
    
    // Find node and container
    const node = nodes.find(n => n.id === nodeId);
    const container = containerRef.current;
    
    if (node && container) {
      // Calculate offset from cursor to node center
      const containerRect = container.getBoundingClientRect();
      const nodeX = (node.x / 100) * containerRect.width;
      const nodeY = (node.y / 100) * containerRect.height;
      
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
    
    // Calculate new position in percentage
    const newX = ((event.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
    const newY = ((event.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;
    
    // Boundary margin adjusts based on screen size
    const boundaryMargin = containerRect.width < 768 ? 20 : 15;
    
    // Keep node within bounds (with some padding)
    const boundedX = Math.min(Math.max(newX, boundaryMargin), 100 - boundaryMargin);
    const boundedY = Math.min(Math.max(newY, boundaryMargin), 100 - boundaryMargin);
    
    // Update the node position
    const updatedNodes = nodes.map(node => 
      node.id === draggedNode 
        ? { ...node, x: boundedX, y: boundedY } 
        : node
    );
    
    updateNodePositions(updatedNodes);
  };
  
  // Handle node drag end
  const handleMouseUp = () => {
    if (draggedNode !== null) {
      setDraggedNode(null);
      
      // Resolve any node overlaps
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        const resolvedNodes = resolveOverlap([...nodes], width, height);
        updateNodePositions(resolvedNodes);
      }
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
        connections={connections}
        containerWidth={containerDimensions.width}
        containerHeight={containerDimensions.height}
        hoveredNode={hoveredNode}
        draggedNode={draggedNode}
        animationOffset={animationOffset}
      />
      
      {nodes.map(node => (
        <NodeComponent
          key={node.id}
          node={node}
          isDragging={draggedNode === node.id}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
        />
      ))}
    </GraphContainer>
  );
};

export default Graph; 