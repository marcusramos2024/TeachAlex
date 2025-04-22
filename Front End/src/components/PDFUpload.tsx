import { useState, useCallback, useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { apiService } from '../services/api';
import { Concept, SubConcept } from './knowledgemap/types';

const UploadContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  maxWidth: 500,
  width: '90%',
  textAlign: 'center',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}));

const UploadIcon = styled(CloudUploadIcon)({
  fontSize: 60,
  color: '#2e79ea',
  marginBottom: '16px',
});

const PDFUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.resetFileUploadStatus();
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    
    try {
      // Clear any previous session flags
      sessionStorage.removeItem('initialMessageAdded');
      sessionStorage.removeItem('conceptsPopupShown');
      
      // Step 1: Extract text from the PDF
      setLoadingStep('Extracting text...');
      const textResponse = await apiService.uploadFile(file);
      
      if (!textResponse || !textResponse.Id) {
        throw new Error('Failed to extract text from PDF');
      }
      
      // Step 2: Extract concepts using the conversation ID
      setLoadingStep('Extracting concepts...');
      const conceptsResponse = await apiService.extractConcepts(textResponse.Id);
      
      let newConcepts: Concept[] = [];
      
      if (conceptsResponse && conceptsResponse.concepts && Array.isArray(conceptsResponse.concepts)) {
        newConcepts = conceptsResponse.concepts.map((concept: any, index: number) => {
          const subConcepts: SubConcept[] = concept.subConcepts ? 
            concept.subConcepts.map((subConcept: any, subIndex: number) => ({
              id: Date.now() + index + subIndex + 2000,
              name: subConcept.name,
              connections: subConcept.connections || []
            })) : [];
            
          return {
            id: Date.now() + index + 1000,
            name: concept.name,
            progress: concept.progress || 0,
            subConcepts: subConcepts
          };
        });
      }
      
      navigate('/chat', { 
        state: { 
          newConcepts,
          initialMessage: conceptsResponse.initial_message,
          conversationId: textResponse.Id
        } 
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  }, [navigate]);

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
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <UploadContainer>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        
        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <CircularProgress size={48} />
            <Typography>{loadingStep || 'Processing...'}</Typography>
          </Box>
        ) : (
          <>
            <UploadIcon />
            <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
              Upload Exam PDF
            </Typography>
            
            <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
              TeachAlex will analyze your exam and help you study.
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={openFileDialog}
              startIcon={<CloudUploadIcon />}
              size="large"
              sx={{ mt: 2 }}
            >
              Upload PDF
            </Button>
            
            {fileName && (
              <Typography sx={{ mt: 2 }}>
                {fileName}
              </Typography>
            )}
          </>
        )}
      </UploadContainer>
    </Box>
  );
};

export default PDFUpload; 