import { IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NavigationControls } from './StyledComponents';

interface ConceptNavigationProps {
  currentIndex: number;
  totalConcepts: number;
  onPrev: () => void;
  onNext: () => void;
}

const ConceptNavigation = ({ 
  currentIndex, 
  totalConcepts, 
  onPrev, 
  onNext 
}: ConceptNavigationProps) => {
  return (
    <NavigationControls>
      <IconButton 
        onClick={onPrev} 
        disabled={currentIndex === 0}
        sx={{ 
          color: 'white',
          padding: '6px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
      
      <Typography variant="body2" sx={{ fontWeight: 500, minWidth: '40px', textAlign: 'center' }}>
        {currentIndex + 1} / {totalConcepts}
      </Typography>
      
      <IconButton 
        onClick={onNext}
        disabled={currentIndex === totalConcepts - 1}
        sx={{ 
          color: 'white',
          padding: '6px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&.Mui-disabled': {
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
    </NavigationControls>
  );
};

export default ConceptNavigation; 