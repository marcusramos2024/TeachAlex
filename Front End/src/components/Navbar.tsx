import '@fontsource/montserrat/600.css';
import { AppBar, Toolbar, Typography, styled, Box } from '@mui/material';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#ffffff',
  color: '#333',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  padding: '6px 0',
  zIndex: 1100,
});

const NavbarContent = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LogoImage = styled('img')({
  width: '32px',
  height: '36px',
  marginRight: '12px',
  filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1))',
});

const Title = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: '1.4rem',
  letterSpacing: '0.5px',
  background: 'linear-gradient(90deg, #175cc3 0%, #2e79ea 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0px 2px 5px rgba(0, 0, 0, 0.08)',
});

const Navbar = () => {  
  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'center', px: { xs: 2, sm: 4 } }}>
        <NavbarContent>
          <LogoContainer>
            <LogoImage src="/Logo.png" alt="Logo" />
            <Title>TeachAlex.com</Title>
          </LogoContainer>
        </NavbarContent>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
