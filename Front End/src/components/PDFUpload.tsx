import { useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import '@fontsource/montserrat/600.css';

// Keyframes for subtle pulsing effect
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(46, 121, 234, 0.3);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(46, 121, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(46, 121, 234, 0);
  }
`;

const UploadContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(8),
  maxWidth: 600,
  width: '90%',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.05)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.08)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '6px',
    background: 'linear-gradient(90deg, #2776e6 0%, #1e59b0 100%)',
  },
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 80,
  color: '#2e79ea',
  marginBottom: theme.spacing(3),
  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
}));

const FileIcon = styled(InsertDriveFileIcon)({
  fontSize: 24,
  marginRight: '8px',
  color: '#2e79ea',
});

const MainHeading = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '2.2rem',
  fontWeight: 600,
  marginBottom: '8px',
  background: 'linear-gradient(90deg, #175cc3 0%, #2e79ea 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0px 2px 5px rgba(0, 0, 0, 0.08)',
});

const SubHeading = styled(Typography)({
  fontSize: '1rem',
  color: '#666',
  marginBottom: '24px',
  maxWidth: '80%',
  lineHeight: 1.6,
});

const DropZone = styled(Box)(({ isDragging }: { isDragging?: boolean }) => ({
  width: '100%',
  padding: '32px',
  marginTop: '16px',
  borderRadius: '12px',
  border: '2px dashed',
  borderColor: isDragging ? '#1e59b0' : 'rgba(46, 121, 234, 0.4)',
  backgroundColor: isDragging ? 'rgba(46, 121, 234, 0.08)' : 'rgba(240, 244, 248, 0.6)',
  transition: 'all 0.2s ease-in-out',
  animation: isDragging ? `${pulse} 1.5s infinite` : 'none',
}));

const UploadButton = styled(Button)({
  marginTop: '24px',
  padding: '10px 24px',
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(46, 121, 234, 0.2)',
  '&:hover': {
    boxShadow: '0 6px 16px rgba(46, 121, 234, 0.3)',
  },
});

const FileInfoText = styled(Typography)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '16px',
  padding: '8px 16px',
  borderRadius: '8px',
  backgroundColor: 'rgba(46, 121, 234, 0.08)',
  color: '#1e59b0',
  fontWeight: 500,
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

const LoadingText = styled(Typography)({
  color: '#1e59b0',
  fontWeight: 500,
  marginTop: '16px',
});

const PDFUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    
    // Simulate file processing (replace with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      // Here you would typically send the file to your backend
      navigate('/chat');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const openFileDialog = () => {
    document.getElementById('pdf-upload')?.click();
  };

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      position: 'relative',
      zIndex: 1,
    }}>
      <UploadContainer elevation={3}>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        
        {isLoading ? (
          <LoadingContainer>
            <CircularProgress size={64} thickness={4} sx={{ color: '#2e79ea' }} />
            <LoadingText variant="h6">
              Processing your exam...
            </LoadingText>
            {fileName && (
              <FileInfoText>
                <FileIcon />
                {fileName}
              </FileInfoText>
            )}
          </LoadingContainer>
        ) : (
          <>
            <UploadIcon />
            <MainHeading variant="h3">
              Upload Your Exam
            </MainHeading>
            <SubHeading variant="body1">
              Upload your PDF exam and TeachAlex will help you understand the concepts and prepare for your test.
            </SubHeading>
            
            <DropZone
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Typography variant="body1" sx={{ color: '#555', fontWeight: 500 }}>
                Drag and drop your PDF file here
              </Typography>
            </DropZone>

            <UploadButton 
              variant="contained" 
              color="primary"
              onClick={openFileDialog}
              disableElevation
            >
              Browse Files
            </UploadButton>
            
            {fileName && (
              <FileInfoText>
                <FileIcon />
                {fileName}
              </FileInfoText>
            )}

            <Typography variant="body2" sx={{ color: '#888', mt: 3 }}>
              Only PDF files are supported
            </Typography>
          </>
        )}
      </UploadContainer>
    </Box>
  );
};

export default PDFUpload; 