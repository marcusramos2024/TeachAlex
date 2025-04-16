import { useEffect, useRef } from 'react';
import { Connection, Node } from './types';

interface GraphCanvasProps {
  nodes: Node[];
  connections: Connection[];
  containerWidth: number;
  containerHeight: number;
  hoveredNode: number | null;
  draggedNode: number | null;
  animationOffset: number;
}

const GraphCanvas = ({ 
  nodes, 
  connections, 
  containerWidth, 
  containerHeight, 
  hoveredNode, 
  draggedNode,
  animationOffset 
}: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the connections between nodes
  const drawConnections = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match container
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add a subtle gradient background effect
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.5, 
      canvas.height * 0.5, 
      0, 
      canvas.width * 0.5, 
      canvas.height * 0.5, 
      canvas.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.06)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // If there are no nodes or connections, we don't need to draw anything else
    if (nodes.length === 0 || connections.length === 0) return;

    // Determine appropriate line width based on container size
    const baseLineWidth = Math.max(1, Math.min(3, containerWidth / 300));
    const highlightedLineWidth = baseLineWidth * 1.5;

    // Draw connections
    connections.forEach(connection => {
      const source = nodes.find(node => node.id === connection.source);
      const target = nodes.find(node => node.id === connection.target);
      
      if (source && target) {
        const sourceX = (source.x / 100) * canvas.width;
        const sourceY = (source.y / 100) * canvas.height;
        const targetX = (target.x / 100) * canvas.width;
        const targetY = (target.y / 100) * canvas.height;
        
        // Calculate line length
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        
        // Determine if this connection involves the hovered node
        const isHighlighted = 
          hoveredNode === source.id || 
          hoveredNode === target.id ||
          draggedNode === source.id ||
          draggedNode === target.id;
        
        // Set line style based on highlight state and screen size
        ctx.strokeStyle = isHighlighted 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = isHighlighted ? highlightedLineWidth : baseLineWidth;
        
        // Adapt dash size to screen size
        const dashSize = Math.max(3, Math.min(5, containerWidth / 200));
        // Animate line with dash pattern
        ctx.beginPath();
        ctx.setLineDash([dashSize, dashSize]);
        ctx.lineDashOffset = -animationOffset; // Animate dash pattern
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        
        // Draw small arrow at end - size proportional to screen
        const arrowSize = isHighlighted ? 
          Math.max(4, Math.min(8, containerWidth / 120)) : 
          Math.max(3, Math.min(6, containerWidth / 150));
        const angle = Math.atan2(dy, dx);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(targetX - arrowSize * Math.cos(angle - Math.PI / 6), 
                targetY - arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(targetX, targetY);
        ctx.lineTo(targetX - arrowSize * Math.cos(angle + Math.PI / 6), 
                targetY - arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    });
  };

  // Draw connections whenever relevant props change
  useEffect(() => {
    drawConnections();
  }, [nodes, connections, containerWidth, containerHeight, hoveredNode, draggedNode, animationOffset]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'absolute', width: '100%', height: '100%' }} 
    />
  );
};

export default GraphCanvas; 