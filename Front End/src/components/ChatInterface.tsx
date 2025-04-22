import { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, styled, Tooltip, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Send as SendIcon, Brush as BrushIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import DrawingCanvas from './canvas/DrawingCanvas';
import { Message } from '../types';
import apiService from '../services/api';
import { useLocation } from 'react-router-dom';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#f0f4f8', // Lighter background to contrast with navbar
  position: 'relative',
});

const MessageList = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#dadce0',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#bdc1c6',
  },
});

const MessageRow = styled(Box)<{ isUser: boolean }>(({ isUser }) => ({
  display: 'flex',
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  width: '100%',
}));

const MessageBubble = styled(motion.div)<{ isUser: boolean }>(({ isUser }) => ({
  padding: '14px 18px',
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isUser ? '#2466cc' : '#ffffff',
  color: isUser ? 'white' : '#333333',
  position: 'relative',
  boxShadow: isUser 
    ? '0 2px 6px rgba(36, 102, 204, 0.2)' 
    : '0 2px 6px rgba(0, 0, 0, 0.08)',
  border: isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
  maxWidth: 'fit-content', // Allow the bubble to shrink to content
}));

const Timestamp = styled('div')({
  fontSize: '0.7rem',
  opacity: 0.7,
  marginTop: '6px',
  textAlign: 'right',
});

const InputContainer = styled(Paper)({
  display: 'flex',
  padding: '16px 24px',
  gap: '12px',
  alignItems: 'center',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '24px',
    backgroundColor: '#f5f7fa',
    '&:hover fieldset': {
      borderColor: '#bdc1c6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2e79ea',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 16px',
  },
});

const DrawingImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '220px',
  borderRadius: '8px',
  marginTop: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
});

const TypingIndicator = styled(motion.div)({
  padding: '12px 16px',
  borderRadius: '18px 18px 18px 4px',
  backgroundColor: '#ffffff',
  display: 'flex',
  gap: '4px',
  marginBottom: '10px',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  maxWidth: 'fit-content',
});

const TypingDot = styled(motion.div)({
  width: '8px',
  height: '8px',
  backgroundColor: '#2e79ea',
  borderRadius: '50%',
});

const ActionButton = styled(IconButton)(({ }) => ({
  borderRadius: '50%',
  padding: '8px',
  color: '#5f6368',
  backgroundColor: '#f5f7fa',
  '&:hover': {
    backgroundColor: '#e8eaed',
  },
}));

const DateDivider = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  margin: '16px 0',
  '&::before, &::after': {
    content: '""',
    flex: 1,
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

const DateText = styled(Typography)({
  padding: '0 16px',
  color: '#5f6368',
  fontSize: '0.8rem',
  fontWeight: 500,
});

const DrawingPreview = styled('img')({
  maxWidth: '80px',
  height: '40px',
  borderRadius: '8px',
  cursor: 'pointer',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  marginRight: '8px',
});

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi, I'm Alex! I'm excited to learn with you. As we discuss different topics, I'll share my understanding using numbers and visuals in the pannel on the left. You can teach me through our conversations or even draw things out—just like we're at the whiteboard in class!",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // New state for the concepts popup
  const [showConceptsPopup, setShowConceptsPopup] = useState(false);
  const [concepts, setConcepts] = useState<string[]>([]);
  const location = useLocation();

  // Effect to set conversation ID from location state
  useEffect(() => {
    if (location.state?.conversationId) {
      setConversationId(location.state.conversationId);
    }
  }, [location.state]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Effect to add initial message if it exists in location state
  useEffect(() => {
    if (location.state?.initialMessage) {
      // Prevent duplicate initial messages by adding a one-time flag
      const initialMessageAdded = sessionStorage.getItem('initialMessageAdded') === 'true';
      
      if (!initialMessageAdded) {
        setMessages(prev => [
          ...prev, 
          {
            id: "initial-message",
            text: location.state.initialMessage,
            isUser: false,
            timestamp: new Date(),
          }
        ]);
        
        // Mark that we've added the initial message
        sessionStorage.setItem('initialMessageAdded', 'true');
      }
    }
  }, [location.state?.initialMessage]);

  // Effect to process concept names for popup
  useEffect(() => {
    if (location.state?.newConcepts && Array.isArray(location.state.newConcepts)) {
      // Extract names for popup
      const conceptNames = location.state.newConcepts.map((concept: any) => concept.name);
      setConcepts(conceptNames);
    }
  }, [location.state]);

  // New effect to show concepts popup once on page load
  useEffect(() => {
    // Check if concepts popup has been shown before
    const conceptsPopupShown = sessionStorage.getItem('conceptsPopupShown') === 'true';
    
    if (!conceptsPopupShown && concepts.length > 0) {
      setShowConceptsPopup(true);
    }
  }, [concepts]);

  // Function to handle closing the concepts popup
  const handleCloseConceptsPopup = () => {
    setShowConceptsPopup(false);
    // Mark that we've shown the popup
    sessionStorage.setItem('conceptsPopupShown', 'true');
  };

  // Function to dispatch concept updates to the VisualizationPane
  const updateConcepts = (conceptsData: any[]) => {
    if (!conceptsData || !Array.isArray(conceptsData)) return;
    
    // Dispatch a custom event with the concepts data
    const event = new CustomEvent('conceptsUpdated', { 
      detail: { concepts: conceptsData } 
    });
    window.dispatchEvent(event);
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !currentDrawing) || isTyping) return;

    // If we don't have a conversation ID, we can't send the message
    if (!conversationId) {
      console.error('No conversation ID available');
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, there's no active conversation. Please upload a document first.", 
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // If we have both drawing and text, send them as separate messages
    if (currentDrawing && inputText.trim()) {
      // First send the drawing message
      const drawingMessage: Message = {
        id: Date.now().toString(),
        text: "",
        isUser: true,
        timestamp: new Date(),
        drawing: currentDrawing,
      };
      
      setMessages(prev => [...prev, drawingMessage]);
      
      // Then send the text message
      const textMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, textMessage]);
      
      // Send to backend
      try {
        setIsTyping(true);
        const response = await apiService.sendMessage(inputText, currentDrawing, conversationId);
        
        // Add AI response
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: response.response || "Sorry, I couldn't process your request.", 
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Update concepts if returned from API
        if (response.concepts && Array.isArray(response.concepts)) {
          // Pass concepts to the VisualizationPane component via custom event
          updateConcepts(response.concepts);
        }
      } catch (error) {
        console.error('Error sending message to backend:', error);
        
        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "Sorry, there was an error communicating with the server.", 
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    } else {
      // If we only have one of them, send as a single message
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText || "Here's my drawing:",
        isUser: true,
        timestamp: new Date(),
        drawing: currentDrawing || undefined,
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Send to backend
      try {
        setIsTyping(true);
        const response = await apiService.sendMessage(
          inputText || "Here's my drawing:", 
          currentDrawing,
          conversationId
        );
        
        // Add AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response || "Sorry, I couldn't process your request.", 
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Update concepts if returned from API
        if (response.concepts && Array.isArray(response.concepts)) {
          // Pass concepts to the VisualizationPane component via custom event
          updateConcepts(response.concepts);
        }
      } catch (error) {
        console.error('Error sending message to backend:', error);
        
        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, there was an error communicating with the server.", 
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
    
    setInputText('');
    setCurrentDrawing(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDrawingComplete = (dataUrl: string) => {
    setCurrentDrawing(dataUrl);
    setShowDrawingCanvas(false);
  };

  const handleDrawingCancel = () => {
    setShowDrawingCanvas(false);
  };

  const clearDrawing = () => {
    setCurrentDrawing(null);
  };

  // Format date for message groups
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  // Group messages by date
  const getDateString = (date: Date) => {
    return date.toDateString();
  };

  // Check if we should show date divider
  const shouldShowDateDivider = (index: number) => {
    if (index === 0) return true;
    const currentDate = getDateString(messages[index].timestamp);
    const prevDate = getDateString(messages[index - 1].timestamp);
    return currentDate !== prevDate;
  };

  return (
    <ChatContainer>
      <MessageList ref={messageListRef}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <Box key={message.id}>
              {shouldShowDateDivider(index) && (
                <DateDivider>
                  <DateText>{formatMessageDate(message.timestamp)}</DateText>
                </DateDivider>
              )}
              
              <MessageRow isUser={message.isUser}>
                <MessageBubble
                  isUser={message.isUser}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {message.text}
                  {message.drawing && (
                    <DrawingImage src={message.drawing} alt="User drawing" />
                  )}
                  <Timestamp>
                    {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  </Timestamp>
                </MessageBubble>
              </MessageRow>
            </Box>
          ))}
          {isTyping && (
            <MessageRow isUser={false}>
              <TypingIndicator
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TypingDot
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0,
                  }}
                />
                <TypingDot
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                />
                <TypingDot
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                />
              </TypingIndicator>
            </MessageRow>
          )}
        </AnimatePresence>
      </MessageList>

      {showDrawingCanvas ? (
        <DrawingCanvas 
          onDrawingComplete={handleDrawingComplete} 
          onCancel={handleDrawingCancel}
        />
      ) : (
        <InputContainer elevation={0}>
          {currentDrawing && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DrawingPreview src={currentDrawing} alt="Your drawing" />
              <IconButton 
                size="small" 
                onClick={clearDrawing}
                sx={{ marginRight: 1 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <StyledTextField
            fullWidth
            multiline
            maxRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={currentDrawing ? "Add text to your drawing (optional)..." : "Type your message..."}
            variant="outlined"
            size="small"
            disabled={isTyping}
          />
          <Tooltip title="Draw">
            <ActionButton 
              onClick={() => setShowDrawingCanvas(true)}
              disabled={isTyping}
              size="medium"
            >
              <BrushIcon fontSize="small" />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Send">
            <ActionButton 
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && !currentDrawing) || isTyping}
              color="primary"
              size="medium"
              sx={{
                backgroundColor: (!inputText.trim() && !currentDrawing) || isTyping ? '#f5f7fa' : '#e7f0ff',
                color: (!inputText.trim() && !currentDrawing) || isTyping ? '#bdc1c6' : '#2466cc',
                '&:hover': {
                  backgroundColor: (!inputText.trim() && !currentDrawing) || isTyping ? '#f5f7fa' : '#d4e4ff',
                }
              }}
            >
              <SendIcon fontSize="small" />
            </ActionButton>
          </Tooltip>
        </InputContainer>
      )}

      {/* Concepts Popup */}
      <Dialog 
        open={showConceptsPopup} 
        onClose={handleCloseConceptsPopup}
        PaperProps={{
          component: motion.div,
          sx: {
            borderRadius: '18px',
            maxWidth: '500px',
            p: 1,
            overflow: 'hidden'
          },
          initial: { opacity: 0, y: 20, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" fontWeight="600" color="primary">
              Extracted Concepts
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleCloseConceptsPopup}
              sx={{ 
                bgcolor: 'rgba(0,0,0,0.04)', 
                '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } 
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The following key concepts were identified from your document. You can discuss and learn about these topics during your chat.
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={1.5} 
            justifyContent="center"
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {concepts.map((concept, index) => (
              <Chip 
                key={index}
                label={concept}
                color="primary"
                component={motion.div}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                sx={{ 
                  borderRadius: '16px', 
                  px: 1.5,
                  py: 2.5,
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  backgroundColor: index % 2 === 0 ? '#e7f0ff' : '#f0f8ff',
                  color: '#2466cc',
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
          <Button 
            onClick={handleCloseConceptsPopup} 
            color="primary" 
            variant="contained"
            sx={{ 
              borderRadius: '24px',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </ChatContainer>
  );
};

export default ChatInterface; 