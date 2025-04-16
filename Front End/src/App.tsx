import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, styled, useMediaQuery } from '@mui/material';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import VisualizationPane from './components/VisualizationPane';
import ChatInterface from './components/ChatInterface';
import Navbar from './components/Navbar';
import PDFUpload from './components/PDFUpload';
import { SpeedInsights } from "@vercel/speed-insights/react"

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
  typography: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
        },
      },
    },
  },
});

const AppContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  backgroundColor: '#f9fafc',
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const LeftPanel = styled(Box)<{ collapsed: boolean }>(({ collapsed }) => ({
  flex: collapsed ? '0 0 60px' : '0 0 40%',
  backgroundColor: '#2e79ea',
  background: 'linear-gradient(135deg, #2776e6 0%, #1e59b0 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px, rgba(0, 0, 0, 0.05) 0px 1px 3px',
  transition: 'flex 0.3s ease',
}));

const RightPanel = styled(Box)<{ leftPanelCollapsed: boolean }>(({ leftPanelCollapsed }) => ({
  flex: leftPanelCollapsed ? '1' : '0 0 60%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  boxShadow: 'inset 4px 0 8px -4px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#f0f4f8',
  transition: 'flex 0.3s ease',
}));

function App() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  // Set default collapsed state based on screen size
  useEffect(() => {
    setLeftPanelCollapsed(isMobile);
  }, [isMobile]);

  const handleToggleCollapse = () => {
    setLeftPanelCollapsed(prev => !prev);
  };

  return (
    <ThemeProvider theme={theme}>     
      <CssBaseline />
      <SpeedInsights />
      <Router>
        <Routes>
          <Route path="/" element={
            <Box sx={{ 
              width: '100%', 
              height: '100vh', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: '#f9fafc',
              backgroundImage: 'radial-gradient(circle at 25px 25px, #f0f4ff 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f0f4ff 2%, transparent 0%)',
              backgroundSize: '100px 100px'
            }}>
              <PDFUpload />
            </Box>
          } />
          <Route path="/chat" element={
            <AppContainer>
              <Navbar />
              <MainContent>
                <LeftPanel collapsed={leftPanelCollapsed}>
                  <VisualizationPane onToggleCollapse={handleToggleCollapse} isCollapsed={leftPanelCollapsed} />
                </LeftPanel>
                <RightPanel leftPanelCollapsed={leftPanelCollapsed}>
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
