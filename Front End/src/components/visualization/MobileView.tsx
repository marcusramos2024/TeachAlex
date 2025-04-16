import { Typography } from '@mui/material';
import MobileOffOutlined from '@mui/icons-material/MobileOffOutlined';
import { MobileMessage } from './StyledComponents';

const MobileView = () => {
  return (
    <MobileMessage>
      <MobileOffOutlined sx={{ fontSize: '3rem', mb: 2, opacity: 0.9 }} />
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Visualization Unavailable
      </Typography>
      <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: '400px', lineHeight: 1.6 }}>
        Sorry, knowledge graph visualizations are not supported on mobile devices at this time.
      </Typography>
    </MobileMessage>
  );
};

export default MobileView; 