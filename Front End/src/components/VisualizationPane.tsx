import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Tooltip } from '@mui/material';
import '@fontsource/montserrat/600.css';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLocation } from 'react-router-dom';

// Import types and components
import { VisualizationPaneProps, SubConcept, Concept } from './knowledgemap/types';
import { Container, CollapseButton } from './knowledgemap/StyledComponents';
import Header from './knowledgemap/Header';
import ConceptDisplay from './knowledgemap/ConceptDisplay';
import Graph from './knowledgemap/Graph';
import ConceptNavigation from './knowledgemap/ConceptNavigation';
import MobileView from './mobile/MobileView';
import CollapsedView from './knowledgemap/CollapsedView';

const VisualizationPane = ({ onToggleCollapse, isCollapsed = false }: VisualizationPaneProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const location = useLocation();
  
  // Setup a reference to the setConcepts function that can be accessed by event listeners
  useEffect(() => {
    // Add an event listener for custom concept updates
    const handleConceptUpdate = (event: CustomEvent<{ concepts: any[] }>) => {
      if (event.detail && Array.isArray(event.detail.concepts)) {
        updateConceptsFromResponse(event.detail.concepts);
      }
    };

    // Add the event listener
    window.addEventListener('conceptsUpdated', handleConceptUpdate);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('conceptsUpdated', handleConceptUpdate);
    };
  }, []);
  
  // Check for new concepts in location state (from file upload)
  useEffect(() => {
    if (location.state && location.state.newConcepts && Array.isArray(location.state.newConcepts)) {
      // Set concepts from location state
      setConcepts(location.state.newConcepts);
      
      // Clear the location state to prevent duplicate processing
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Function to update concepts when receiving response from API
  const updateConceptsFromResponse = (newConceptsData: any[]) => {
    setConcepts(prevConcepts => {
      // If there are no previous concepts, initialize from the new concepts
      if (prevConcepts.length === 0 && newConceptsData.length > 0) {
        return newConceptsData.map((concept, index) => ({
          id: Date.now() + index + 1000,
          name: concept.name,
          progress: concept.progress || 0,
          subConcepts: concept.subConcepts?.map((sub: any, idx: number) => ({
            id: Date.now() + index + idx + 2000,
            name: sub.name,
            connections: sub.connections || []
          })) || []
        }));
      }

      // Otherwise update existing concepts
      return prevConcepts.map(existingConcept => {
        // Find matching concept by name
        const matchingConcept = newConceptsData.find(
          newConcept => newConcept.name === existingConcept.name
        );

        if (matchingConcept) {
          // Map subConcepts
          const updatedSubConcepts = existingConcept.subConcepts.map(existingSub => {
            const matchingSub = matchingConcept.subConcepts?.find(
              (newSub: any) => newSub.name === existingSub.name
            );
            
            if (matchingSub) {
              return {
                ...existingSub,
                connections: matchingSub.connections || existingSub.connections
              };
            }
            return existingSub;
          });

          // Add any new subConcepts
          if (matchingConcept.subConcepts) {
            matchingConcept.subConcepts.forEach((newSub: any) => {
              const exists = updatedSubConcepts.some(existingSub => existingSub.name === newSub.name);
              
              if (!exists) {
                updatedSubConcepts.push({
                  id: Date.now() + Math.floor(Math.random() * 1000),
                  name: newSub.name,
                  connections: newSub.connections || []
                });
              }
            });
          }

          return {
            ...existingConcept,
            progress: matchingConcept.progress !== undefined 
              ? matchingConcept.progress 
              : existingConcept.progress,
            subConcepts: updatedSubConcepts
          };
        }
        return existingConcept;
      });
    });
  };

  // Current concept data
  const currentConcept = concepts[currentConceptIndex] || { name: '', progress: 0, subConcepts: [] };

  // Navigate to next concept
  const handleNextConcept = () => {
    if (currentConceptIndex < concepts.length - 1) {
      setCurrentConceptIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous concept
  const handlePrevConcept = () => {
    if (currentConceptIndex > 0) {
      setCurrentConceptIndex(prev => prev - 1);
    }
  };

  // Update node positions for a specific concept
  const updateNodePositions = (updatedNodes: SubConcept[]) => {
    setConcepts(prevConcepts => {
      const newConcepts = [...prevConcepts];
      newConcepts[currentConceptIndex] = {
        ...newConcepts[currentConceptIndex],
        subConcepts: updatedNodes
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
          <CollapseButton isCollapsed={isCollapsed} onClick={onToggleCollapse}>
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
        <CollapseButton isCollapsed={isCollapsed} onClick={onToggleCollapse}>
          <ChevronRightIcon />
        </CollapseButton>
      </Tooltip>
      <Header />
      <ConceptDisplay concept={currentConcept} />
      <Graph 
        nodes={currentConcept.subConcepts} 
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