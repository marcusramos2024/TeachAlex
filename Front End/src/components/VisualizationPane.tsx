import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Box, Typography, LinearProgress, styled, Paper, keyframes, IconButton, useMediaQuery, useTheme } from '@mui/material';
import '@fontsource/montserrat/600.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MobileOffOutlined from '@mui/icons-material/MobileOffOutlined';

// Keyframes for pulsing effect
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

// Styled components
const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  padding: '24px',
  color: '#fff',
  position: 'relative',
});

const MainHeading = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
  fontWeight: 600,
  marginBottom: '8px',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
});

const HeaderSection = styled(Box)({
  marginBottom: '24px',
  padding: '18px 22px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
});

const ConceptSection = styled(Box)({
  marginBottom: '24px',
  padding: '16px 20px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)',
});

const SubHeading = styled(Typography)({
  fontSize: '0.95rem',
  opacity: 0.9,
  marginBottom: '20px',
  fontWeight: 300,
  textAlign: 'center',
});

const ConceptTitle = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1.4rem',
  fontWeight: 600,
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
});

const GraphContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 'inset 0 1px 8px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  marginBottom: '20px',
  minHeight: '300px',
  height: 'calc(100% - 200px)',
});

const NodeItem = styled(Paper)(({ isActive, isDragging }: { isActive?: boolean, isDragging?: boolean }) => ({
  position: 'absolute',
  padding: '10px 15px',
  borderRadius: '20px',
  backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.95)',
  color: '#1a62d6',
  fontWeight: isActive ? 600 : 400,
  fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
  width: 'auto',
  maxWidth: 'clamp(120px, 22vw, 200px)',
  boxShadow: isDragging 
    ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.15)' 
    : isActive 
      ? '0 4px 20px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(255, 255, 255, 0.1)' 
      : '0 2px 10px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(255, 255, 255, 0.08)',
  zIndex: isDragging ? 10 : isActive ? 3 : 2,
  transition: isDragging ? 'none' : 'all 0.3s ease',
  transform: isDragging 
    ? 'translate(-50%, -50%) scale(1.1)' 
    : isActive 
      ? 'translate(-50%, -50%) scale(1.05)' 
      : 'translate(-50%, -50%) scale(1)',
  animation: isActive && !isDragging ? `${pulse} 2s infinite` : 'none',
  cursor: 'grab',
  userSelect: 'none',
  textAlign: 'center',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'clamp(32px, 6vh, 50px)',
  '&:hover': {
    backgroundColor: '#ffffff',
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(255, 255, 255, 0.1)',
  },
  '&:active': {
    cursor: 'grabbing',
  },
  '@media (max-width: 768px)': {
    padding: '8px 12px',
    minHeight: 'clamp(28px, 5vh, 40px)',
  }
}));

const NavigationControls = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
});

const MobileMessage = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '24px',
  color: '#fff',
  textAlign: 'center',
  gap: '16px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  borderRadius: '12px',
});

// Interface for node and concept types
interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  isActive?: boolean;
}

interface Connection {
  source: number;
  target: number;
}

interface Concept {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  nodes: Node[];
  connections: Connection[];
}

// Check if nodes are overlapping
const areNodesOverlapping = (node1: Node, node2: Node, containerWidth: number, containerHeight: number) => {
  // Convert percentage to pixels
  const node1X = (node1.x / 100) * containerWidth;
  const node1Y = (node1.y / 100) * containerHeight;
  const node2X = (node2.x / 100) * containerWidth;
  const node2Y = (node2.y / 100) * containerHeight;
  
  // Approximate node dimensions with responsive sizing
  const baseNodeWidth = Math.min(160, containerWidth * 0.2);
  const minDistance = baseNodeWidth * 0.8; // Allow some overlap
  
  const distance = Math.sqrt(
    Math.pow(node1X - node2X, 2) + 
    Math.pow(node1Y - node2Y, 2)
  );
  
  return distance < minDistance;
};

// Move overlapping nodes apart
const resolveOverlap = (nodes: Node[], containerWidth: number, containerHeight: number) => {
  const adjustmentFactor = containerWidth < 600 ? 8 : 5; // Increase spacing on smaller screens
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (areNodesOverlapping(nodes[i], nodes[j], containerWidth, containerHeight)) {
        // Calculate direction to push
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const angle = Math.atan2(dy, dx);
        
        // Move nodes apart with more space on smaller screens
        const boundaryMargin = containerWidth < 768 ? 20 : 15;
        nodes[j].x = Math.min(Math.max(nodes[j].x + (Math.cos(angle) * adjustmentFactor), boundaryMargin), 100 - boundaryMargin);
        nodes[j].y = Math.min(Math.max(nodes[j].y + (Math.sin(angle) * adjustmentFactor), boundaryMargin), 100 - boundaryMargin);
      }
    }
  }
  
  return nodes;
};

const VisualizationPane = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationOffset, setAnimationOffset] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [concepts, setConcepts] = useState<Concept[]>([
    {
      id: 1,
      title: "Neural Networks",
      subtitle: "Understanding Machine Learning Fundamentals",
      progress: 72,
      nodes: [
        { id: 1, label: "Neural Networks", x: 50, y: 50, isActive: true },
        { id: 2, label: "Backpropagation", x: 25, y: 20 },
        { id: 3, label: "Activation Functions", x: 75, y: 25 },
        { id: 4, label: "Loss Functions", x: 85, y: 70 },
        { id: 5, label: "Gradient Descent", x: 35, y: 80 },
        { id: 6, label: "Transfer Learning", x: 60, y: 85 },
      ],
      connections: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 1, target: 4 },
        { source: 1, target: 5 },
        { source: 2, target: 5 },
        { source: 3, target: 4 },
        { source: 1, target: 6 },
        { source: 4, target: 6 },
      ],
    },
    {
      id: 2,
      title: "Natural Language Processing",
      subtitle: "Text Understanding and Generation",
      progress: 45,
      nodes: [
        { id: 1, label: "Natural Language Processing", x: 50, y: 50, isActive: true },
        { id: 2, label: "Word Embeddings", x: 30, y: 25 },
        { id: 3, label: "Transformers", x: 70, y: 30 },
        { id: 4, label: "Attention Mechanism", x: 80, y: 65 },
        { id: 5, label: "Sequence Models", x: 30, y: 75 },
        { id: 6, label: "Text Classification", x: 55, y: 80 },
      ],
      connections: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 1, target: 5 },
        { source: 3, target: 4 },
        { source: 5, target: 6 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
      ],
    },
    {
      id: 3,
      title: "Computer Vision",
      subtitle: "Image Understanding and Processing",
      progress: 58,
      nodes: [
        { id: 1, label: "Computer Vision", x: 50, y: 50, isActive: true },
        { id: 2, label: "Convolutional Networks", x: 25, y: 30 },
        { id: 3, label: "Image Classification", x: 75, y: 30 },
        { id: 4, label: "Object Detection", x: 80, y: 60 },
        { id: 5, label: "Image Segmentation", x: 35, y: 70 },
        { id: 6, label: "Feature Extraction", x: 60, y: 80 },
      ],
      connections: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 3 },
        { source: 3, target: 4 },
        { source: 1, target: 5 },
        { source: 2, target: 6 },
        { source: 6, target: 3 },
      ],
    }
  ]);

  // Current concept data
  const currentConcept = concepts[currentConceptIndex];
  
  // Ensure nodes don't overlap initially
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      // Resolve overlaps for each concept
      setConcepts(prevConcepts => 
        prevConcepts.map(concept => ({
          ...concept,
          nodes: resolveOverlap([...concept.nodes], width, height)
        }))
      );
    }
  }, []);

  // Draw the connections between nodes
  const drawConnections = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

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

    // Determine appropriate line width based on container size
    const baseLineWidth = Math.max(1, Math.min(3, container.clientWidth / 300));
    const highlightedLineWidth = baseLineWidth * 1.5;

    // Draw connections
    currentConcept.connections.forEach(connection => {
      const source = currentConcept.nodes.find(node => node.id === connection.source);
      const target = currentConcept.nodes.find(node => node.id === connection.target);
      
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
        const dashSize = Math.max(3, Math.min(5, container.clientWidth / 200));
        // Animate line with dash pattern
        ctx.beginPath();
        ctx.setLineDash([dashSize, dashSize]);
        ctx.lineDashOffset = -animationOffset; // Animate dash pattern
        ctx.moveTo(sourceX, sourceY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        
        // Draw small arrow at end - size proportional to screen
        const arrowSize = isHighlighted ? 
          Math.max(4, Math.min(8, container.clientWidth / 120)) : 
          Math.max(3, Math.min(6, container.clientWidth / 150));
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
  
  // Handle node drag start
  const handleMouseDown = (event: MouseEvent, nodeId: number) => {
    event.preventDefault();
    
    // Find node and container
    const node = currentConcept.nodes.find(n => n.id === nodeId);
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
    
    // Update the concept nodes using setState
    setConcepts(prevConcepts => {
      const newConcepts = [...prevConcepts];
      
      // Create a new array of nodes with the updated position
      newConcepts[currentConceptIndex] = {
        ...newConcepts[currentConceptIndex],
        nodes: newConcepts[currentConceptIndex].nodes.map(node => 
          node.id === draggedNode 
            ? { ...node, x: boundedX, y: boundedY } 
            : node
        )
      };
      
      return newConcepts;
    });
  };
  
  // Handle node drag end
  const handleMouseUp = () => {
    if (draggedNode !== null) {
      setDraggedNode(null);
      
      // Resolve any node overlaps
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        setConcepts(prevConcepts => {
          const newConcepts = [...prevConcepts];
          
          newConcepts[currentConceptIndex] = {
            ...newConcepts[currentConceptIndex],
            nodes: resolveOverlap(
              [...newConcepts[currentConceptIndex].nodes], 
              width, 
              height
            )
          };
          
          return newConcepts;
        });
      }
    }
  };
  
  // Navigate to next concept
  const handleNextConcept = () => {
    setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
  };
  
  // Navigate to previous concept
  const handlePrevConcept = () => {
    setCurrentConceptIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
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

  // Draw connections
  useEffect(() => {
    drawConnections();
    
    // Make nodes responsive and reset overlaps when window size changes
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        // Resolve overlaps for current concept when window is resized
        setConcepts(prevConcepts => {
          const newConcepts = [...prevConcepts];
          newConcepts[currentConceptIndex] = {
            ...newConcepts[currentConceptIndex],
            nodes: resolveOverlap([...newConcepts[currentConceptIndex].nodes], width, height)
          };
          return newConcepts;
        });
        
        drawConnections();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Setup global mouse event handlers
    window.addEventListener('mousemove', handleMouseMove as any);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [animationOffset, hoveredNode, draggedNode, currentConceptIndex]);
  
  // Ensure the graph redraws when container is resized (not just window)
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        drawConnections();
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <MobileMessage>
          <MobileOffOutlined sx={{ fontSize: '3rem', mb: 2, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Visualization Unavailable
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '400px', lineHeight: 1.6 }}>
            Sorry, knowledge graph visualizations are not supported on mobile devices at this time.
          </Typography>
        </MobileMessage>
      ) : (
        <Container>
          <HeaderSection>
            <MainHeading>Alex's Understanding</MainHeading>
            <SubHeading>Below is a visual representation of Alex's Understanding for each concept. Navigate concepts by selecting the arrow keys</SubHeading>
          </HeaderSection>

          <ConceptSection>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <ConceptTitle>
                {currentConcept.title}
              </ConceptTitle>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.85, minWidth: '60px' }}>
                Understanding:
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={currentConcept.progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ffffff',
                  }
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 500, minWidth: '40px', textAlign: 'right' }}>
                {currentConcept.progress}%
              </Typography>
            </Box>
          </ConceptSection>

          <GraphContainer ref={containerRef}>
            <canvas ref={canvasRef} style={{ position: 'absolute', width: '100%', height: '100%' }} />
            
            {currentConcept.nodes.map(node => (
              <NodeItem 
                key={node.id}
                isActive={node.isActive}
                isDragging={draggedNode === node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
              >
                {node.label}
              </NodeItem>
            ))}
          </GraphContainer>
          
          <NavigationControls>
            <IconButton 
              onClick={handlePrevConcept} 
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Typography variant="body2" sx={{ fontWeight: 500, minWidth: '45px', textAlign: 'center' }}>
              {currentConceptIndex + 1} / {concepts.length}
            </Typography>
            
            <IconButton 
              onClick={handleNextConcept}
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </NavigationControls>
        </Container>
      )}
    </>
  );
};

export default VisualizationPane; 