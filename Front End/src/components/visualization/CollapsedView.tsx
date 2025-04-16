import { Box, Typography } from '@mui/material';

const CollapsedView = () => {
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Typography 
        sx={{ 
          transform: 'rotate(-90deg)', 
          whiteSpace: 'nowrap',
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 600,
          fontSize: '1.2rem',
          letterSpacing: '1px',
          color: 'white',
          opacity: 0.9
        }}
      >
        Alex's Understanding
      </Typography>
    </Box>
  );
};

export default CollapsedView; 