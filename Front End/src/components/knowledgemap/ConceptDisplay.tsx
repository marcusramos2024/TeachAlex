import { Box, Typography, LinearProgress } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Concept } from './types';
import { ConceptSection, ConceptTitle } from './StyledComponents';

interface ConceptDisplayProps {
  concept: Concept;
}

const ConceptDisplay = ({ concept }: ConceptDisplayProps) => {
  // State to track the previous and current progress values
  const [displayedProgress, setDisplayedProgress] = useState(concept.progress);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevProgressRef = useRef(concept.progress);

  // Detect changes in progress value
  useEffect(() => {
    // Skip animation on first render or if there's no change
    if (prevProgressRef.current === concept.progress) {
      return;
    }
    
    // Start animation
    setIsAnimating(true);
    
    // Animate from previous value to new value
    const timer = setTimeout(() => {
      setDisplayedProgress(concept.progress);
      setIsAnimating(false);
      prevProgressRef.current = concept.progress;
    }, 600); // Duration of the animation
    
    return () => clearTimeout(timer);
  }, [concept.progress]);

  return (
    <ConceptSection>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ConceptTitle>
          {concept.name}
        </ConceptTitle>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.85, minWidth: '60px' }}>
          Understanding:
        </Typography>
        <Box sx={{ position: 'relative', flex: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={displayedProgress}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              transition: 'all 0.6s ease-in-out',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ffffff',
                transition: 'transform 0.6s ease-in-out',
              }
            }} 
          />
          {isAnimating && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 4,
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>
        <Typography 
          component={motion.div}
          initial={{ scale: 1 }}
          animate={isAnimating ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.4 }}
          variant="body2" 
          sx={{ 
            fontWeight: 500, 
            minWidth: '40px', 
            textAlign: 'right',
            color: isAnimating ? '#ffffff' : undefined,
          }}
        >
          {displayedProgress}%
        </Typography>
      </Box>
    </ConceptSection>
  );
};

export default ConceptDisplay; 