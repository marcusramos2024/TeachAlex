import { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, styled, Tooltip, Typography } from '@mui/material';
import { Send as SendIcon, Brush as BrushIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import DrawingCanvas from './DrawingCanvas';
import { Message } from '../types';

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

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: "Welcome to TeachAlex! I'm here to help you learn and understand new concepts.",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "welcome-2",
      text: "You can ask me questions, share ideas, or even draw diagrams to explain your thoughts.",
      isUser: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isTyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "I'm here to help you learn! What concepts would you like me to explain? I can break down complex topics into simpler terms.",
      isUser: false,
      timestamp: new Date(),
    };

    // Add the message to the chat
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDrawingComplete = (dataUrl: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: 'Here\'s my drawing to help explain my question:',
      isUser: true,
      timestamp: new Date(),
      drawing: dataUrl,
    };

    setMessages(prev => [...prev, newMessage]);
    setShowDrawingCanvas(false);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great visual explanation! I understand your question better now. Let me help clarify this concept for you.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleDrawingCancel = () => {
    setShowDrawingCanvas(false);
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
          <StyledTextField
            fullWidth
            multiline
            maxRows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
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
              disabled={!inputText.trim() || isTyping}
              color="primary"
              size="medium"
              sx={{
                backgroundColor: !inputText.trim() || isTyping ? '#f5f7fa' : '#e7f0ff',
                color: !inputText.trim() || isTyping ? '#bdc1c6' : '#2466cc',
                '&:hover': {
                  backgroundColor: !inputText.trim() || isTyping ? '#f5f7fa' : '#d4e4ff',
                }
              }}
            >
              <SendIcon fontSize="small" />
            </ActionButton>
          </Tooltip>
        </InputContainer>
      )}
    </ChatContainer>
  );
};

export default ChatInterface; 