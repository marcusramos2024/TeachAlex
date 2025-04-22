import { Typography, Box } from '@mui/material';
import MobileOffOutlined from '@mui/icons-material/MobileOffOutlined';
import { MobileMessage } from '../knowledgemap/StyledComponents';
import { Concept } from '../knowledgemap/types';
import ConceptNavigation from '../knowledgemap/ConceptNavigation';

interface MobileViewProps {
  concept: Concept;
  currentIndex: number;
  totalConcepts: number;
  onPrev: () => void;
  onNext: () => void;
}

const MobileView = ({ concept, currentIndex, totalConcepts, onPrev, onNext }: MobileViewProps) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ flex: 1 }}>
        <MobileMessage>
          <MobileOffOutlined sx={{ fontSize: '3rem', mb: 2, opacity: 0.9 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Visualization Unavailable
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '400px', lineHeight: 1.6, textAlign: 'center', mb: 3 }}>
            Sorry, knowledge graph visualizations are not supported on mobile devices at this time.
          </Typography>
          
          {concept && (
            <Box sx={{ 
              border: '1px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: 2, 
              p: 2, 
              maxWidth: '400px', 
              width: '100%' 
            }}>
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                {concept.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Understanding: {concept.progress}%
              </Typography>
              <Typography variant="body2">
                Nodes: {concept.subConcepts.length}
              </Typography>
            </Box>
          )}
        </MobileMessage>
      </Box>
      
      <ConceptNavigation
        currentIndex={currentIndex}
        totalConcepts={totalConcepts}
        onPrev={onPrev}
        onNext={onNext}
      />
    </Box>
  );
};

export default MobileView; 