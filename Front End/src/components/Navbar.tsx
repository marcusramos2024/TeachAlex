import '@fontsource/montserrat/600.css';
import { AppBar, Toolbar, Typography, styled } from '@mui/material';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  color: '#333',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const LogoImage = styled('img')({
  width: '35px',
  height: '40px',
  marginRight: '16px',
});

const Title = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  color: '#175cc3',
  fontSize: '1.75rem',
  letterSpacing: '0.5px',
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'center' }}>
        <LogoImage src="/Logo.png" alt="Logo" />
        <Title>TeachAlex.com</Title>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
