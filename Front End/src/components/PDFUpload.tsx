import { useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6),
  maxWidth: 600,
  width: '90%',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: '2px dashed #2196f3',
  backgroundColor: '#f8f9fa',
  '&:hover': {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
  },
}));

const UploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 64,
  color: '#2196f3',
  marginBottom: theme.spacing(2),
}));

const PDFUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

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

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <UploadContainer
        elevation={isDragging ? 8 : 2}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('pdf-upload')?.click()}
      >
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        
        {isLoading ? (
          <CircularProgress size={60} />
        ) : (
          <>
            <UploadIcon />
            <Typography variant="h4" gutterBottom>
              Upload Your Exam PDF
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop your PDF file here, or click to select a file
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Only PDF files are supported
            </Typography>
          </>
        )}
      </UploadContainer>
    </Box>
  );
};

export default PDFUpload; 