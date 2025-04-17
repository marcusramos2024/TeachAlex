import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Tooltip } from '@mui/material';
import '@fontsource/montserrat/600.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import types and components
import { VisualizationPaneProps, Node } from './visualization/types';
import { Container, CollapseButton } from './visualization/StyledComponents';
import { initialConcepts } from './visualization/conceptData';
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

  // Display mobile view on smaller screens
  if (isMobile) {
    return (
      <Container>
        <MobileView
          concept={currentConcept}
          onPrev={handlePrevConcept}
          onNext={handleNextConcept}
          currentIndex={currentConceptIndex}
          totalConcepts={concepts.length}
        />
      </Container>
    );
  }
  
  // Display collapsed view when visualizer is collapsed
  if (isCollapsed) {
    return (
      <Container>
        <Tooltip title="Expand visualization pane" placement="left">
          <CollapseButton onClick={onToggleCollapse}>
            <ChevronLeftIcon />
          </CollapseButton>
        </Tooltip>
        <CollapsedView />
      </Container>
    );
  }

  return (
    <Container>
      <Tooltip title="Collapse visualization pane" placement="left">
        <CollapseButton onClick={onToggleCollapse}>
          <ChevronRightIcon />
        </CollapseButton>
      </Tooltip>
      <Header />
      <ConceptDisplay concept={currentConcept} />
      <Graph 
        nodes={currentConcept.nodes} 
        currentConceptIndex={currentConceptIndex}
        updateNodePositions={updateNodePositions} 
      />
      <ConceptNavigation 
        currentIndex={currentConceptIndex}
        totalConcepts={concepts.length}
        onPrev={handlePrevConcept}
        onNext={handleNextConcept}
      />
    </Container>
  );
};

export default VisualizationPane; 