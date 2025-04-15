import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, styled } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RobotMascot from './components/RobotMascot';
import ChatInterface from './components/ChatInterface';
import Navbar from './components/Navbar';
import PDFUpload from './components/PDFUpload';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e79ea',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const AppContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const LeftPanel = styled(Box)({
  flex: '0 0 40%',
  backgroundColor: '#2e79ea',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px',
});

const RightPanel = styled(Box)({
  flex: '0 0 60%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PDFUpload />
            </Box>
          } />
          <Route path="/chat" element={
            <AppContainer>
              <Navbar />
              <MainContent>
                <LeftPanel>
                  <RobotMascot />
                </LeftPanel>
                <RightPanel>
                  <ChatInterface />
                </RightPanel>
              </MainContent>
            </AppContainer>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
