import { Box, Typography, Paper, styled, keyframes, IconButton } from '@mui/material';

// Keyframes for pulsing effect
export const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

// Styled components
export const Container = styled(Box)<{ isCollapsed?: boolean }>(({ isCollapsed }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: isCollapsed ? '60px' : '100%',
  padding: isCollapsed ? '12px 0' : '24px',
  color: '#fff',
  position: 'relative',
  overflow: 'hidden',
}));

export const MainHeading = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
  fontWeight: 600,
  marginBottom: '8px',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
});

export const HeaderSection = styled(Box)({
  marginBottom: '24px',
  marginTop: '16px',
  padding: '18px 22px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)',
  textAlign: 'center',
  position: 'relative',
});

export const ConceptSection = styled(Box)({
  marginBottom: '24px',
  padding: '16px 20px',
  borderRadius: '12px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  boxShadow: 'inset 0 1px 5px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.05)',
});

export const SubHeading = styled(Typography)({
  fontSize: '0.95rem',
  opacity: 0.9,
  marginBottom: '20px',
  fontWeight: 300,
  textAlign: 'center',
});

export const ConceptTitle = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '1.4rem',
  fontWeight: 600,
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
});

export const GraphContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  borderRadius: '12px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: 'inset 0 1px 8px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  marginBottom: '20px',
  minHeight: '300px',
  height: 'calc(100% - 200px)',
});

export const NodeItem = styled(Paper)(({ isDragging }: { isDragging?: boolean }) => ({
  position: 'absolute',
  padding: '10px 15px',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  color: '#1a62d6',
  fontWeight: 400,
  fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
  width: 'auto',
  maxWidth: 'clamp(120px, 22vw, 200px)',
  boxShadow: isDragging 
    ? '0 8px 25px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.15)' 
    : '0 2px 10px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(255, 255, 255, 0.08)',
  zIndex: isDragging ? 10 : 2,
  transition: isDragging ? 'none' : 'all 0.3s ease',
  transform: isDragging 
    ? 'translate(-50%, -50%) scale(1.1)' 
    : 'translate(-50%, -50%) scale(1)',
  animation: 'none',
  cursor: 'grab',
  userSelect: 'none',
  textAlign: 'center',
  whiteSpace: 'normal',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  lineHeight: '1.2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'clamp(32px, 6vh, 50px)',
  '&:hover': {
    backgroundColor: '#ffffff',
    transform: 'translate(-50%, -50%) scale(1.1)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(255, 255, 255, 0.1)',
  },
  '&:active': {
    cursor: 'grabbing',
  },
  '@media (max-width: 768px)': {
    padding: '8px 12px',
    minHeight: 'clamp(28px, 5vh, 40px)',
  }
}));

export const NavigationControls = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 16px',
  borderRadius: '30px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  maxWidth: '180px',
  margin: '0 auto',
});

export const MobileMessage = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  padding: '24px',
  color: '#fff',
  textAlign: 'center',
  gap: '16px',
  background: 'rgba(0, 0, 0, 0.07)',
  backdropFilter: 'blur(5px)',
  borderRadius: '12px',
});

export const CollapseButton = styled(IconButton)<{ isCollapsed?: boolean }>(({isCollapsed }) => ({
  position: 'absolute',
  bottom: '30px',
  right: isCollapsed ? '50%' : '22px',
  transform: isCollapsed ? 'translateX(50%)' : 'none',
  backgroundColor: 'rgba(255, 255, 255, 0.12)',
  color: '#fff',
  borderRadius: '50%',
  padding: '8px',
  width: '36px',
  height: '36px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
  },
  zIndex: 10,
  opacity: 0.8,
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  '@media (max-width: 768px)': {
    bottom: '16px',
    right: isCollapsed ? '50%' : '12px',
    width: '32px',
    height: '32px',
    padding: '6px',
  }
})); 