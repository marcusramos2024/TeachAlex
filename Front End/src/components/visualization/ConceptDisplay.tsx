import { Box, Typography, LinearProgress } from '@mui/material';
import { Concept } from './types';
import { ConceptSection, ConceptTitle } from './StyledComponents';

interface ConceptDisplayProps {
  concept: Concept;
}

const ConceptDisplay = ({ concept }: ConceptDisplayProps) => {
  return (
    <ConceptSection>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ConceptTitle>
          {concept.title}
        </ConceptTitle>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.85, minWidth: '60px' }}>
          Understanding:
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={concept.progress} 
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
          {concept.progress}%
        </Typography>
      </Box>
    </ConceptSection>
  );
};

export default ConceptDisplay; 