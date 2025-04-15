import { Box, styled } from '@mui/material';
import { motion } from 'framer-motion';
const RobotContainer = styled(motion.div)({
  position: 'relative',
  width: '300px',
  height: '300px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const RobotImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const StatusMessage = styled(motion.div)({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)',
  padding: '10px 20px',
  borderRadius: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  fontSize: '16px',
  color: '#333',
});

const RobotMascot = () => {
  return (
    <RobotContainer
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <RobotImage src="/Robot.png"/>
      {/* <StatusMessage
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Hello! I'm Alex, your learning companion!
      </StatusMessage> */}
    </RobotContainer>
  );
};

export default RobotMascot; 