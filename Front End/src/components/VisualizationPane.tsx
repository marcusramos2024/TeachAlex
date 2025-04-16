import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Tooltip } from '@mui/material';
import '@fontsource/montserrat/600.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import types and components
import { VisualizationPaneProps, Node } from './visualization/types';
import { Container, CollapseButton } from './visualization/StyledComponents';
import { initialConcepts } from './visualization/conceptData';
import { resolveOverlap } from './visualization/graphUtils';
import Header from './visualization/Header';
import ConceptDisplay from './visualization/ConceptDisplay';
import Graph from './visualization/Graph';
import ConceptNavigation from './visualization/ConceptNavigation';
import MobileView from './visualization/MobileView';
import CollapsedView from './visualization/CollapsedView';

const VisualizationPane = ({ onToggleCollapse, isCollapsed = false }: VisualizationPaneProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [concepts, setConcepts] = useState(initialConcepts);

  // Current concept data
  const currentConcept = concepts[currentConceptIndex];
  
  // Ensure nodes don't overlap initially
  useEffect(() => {
    if (!isMobile && !isCollapsed) {
      // Resolve overlaps for each concept when window is resized
      const handleResize = () => {
        const container = document.querySelector('[class*="GraphContainer"]');
        if (container) {
          const width = container.clientWidth;
          const height = container.clientHeight;
          
          setConcepts(prevConcepts => 
            prevConcepts.map(concept => ({
              ...concept,
              nodes: resolveOverlap([...concept.nodes], width, height)
            }))
          );
        }
      };
      
      // Initial resolution
      handleResize();
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMobile, isCollapsed]);
  
  // Navigate to next concept
  const handleNextConcept = () => {
    setCurrentConceptIndex((prev) => (prev + 1) % concepts.length);
  };
  
  // Navigate to previous concept
  const handlePrevConcept = () => {
    setCurrentConceptIndex((prev) => (prev - 1 + concepts.length) % concepts.length);
  };

  // Update node positions for a specific concept
  const updateNodePositions = (updatedNodes: Node[]) => {
    setConcepts(prevConcepts => {
      const newConcepts = [...prevConcepts];
      newConcepts[currentConceptIndex] = {
        ...newConcepts[currentConceptIndex],
        nodes: updatedNodes
      };
      return newConcepts;
    });
  };

  return (
    <>
      {isMobile && !isCollapsed ? (
        <Container isCollapsed={false}>
          {/* Show visualization unavailable message when expanded on mobile */}
          <Tooltip title="Collapse panel" placement="top">
            <CollapseButton onClick={onToggleCollapse} isCollapsed={false}>
              <ChevronLeftIcon />
            </CollapseButton>
          </Tooltip>
          
          <MobileView />
        </Container>
      ) : (
        <Container isCollapsed={isCollapsed}>
          {/* Move the collapse button to the bottom of the container */}
          <Tooltip title={isCollapsed ? "Expand panel" : "Collapse panel"} placement="top">
            <CollapseButton onClick={onToggleCollapse} isCollapsed={isCollapsed}>
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </CollapseButton>
          </Tooltip>

          {!isCollapsed && !isMobile && (
            <>
              <Header />
              
              <ConceptDisplay concept={currentConcept} />
              
              <Graph 
                nodes={currentConcept.nodes}
                connections={currentConcept.connections} 
                currentConceptIndex={currentConceptIndex}
                updateNodePositions={updateNodePositions}
              />
              
              <ConceptNavigation 
                currentIndex={currentConceptIndex}
                totalConcepts={concepts.length}
                onPrev={handlePrevConcept}
                onNext={handleNextConcept}
              />
            </>
          )}

          {isCollapsed && <CollapsedView />}
        </Container>
      )}
    </>
  );
};

export default VisualizationPane; 