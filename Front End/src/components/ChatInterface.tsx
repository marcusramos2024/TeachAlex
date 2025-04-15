import { useState, useRef, useEffect } from 'react';
import { Box, Paper, TextField, IconButton, styled, Tooltip } from '@mui/material';
import { Send as SendIcon, Brush as BrushIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import DrawingCanvas from './DrawingCanvas';
import { Message } from '../types';

const ChatContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '20px',
  gap: '20px',
});

const MessageList = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '10px',
});

const MessageBubble = styled(motion.div)<{ isUser: boolean }>(({ isUser }) => ({
  maxWidth: '70%',
  padding: '12px 16px',
  borderRadius: '20px',
  backgroundColor: isUser ? '#2e79ea' : '#e0e0e0',
  color: isUser ? 'white' : 'black',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  position: 'relative',
}));

const Timestamp = styled('div')({
  fontSize: '0.7rem',
  opacity: 0.7,
  marginTop: '4px',
});

const InputContainer = styled(Paper)({
  display: 'flex',
  padding: '10px',
  gap: '10px',
  alignItems: 'center',
});

const DrawingImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '200px',
  borderRadius: '8px',
  marginTop: '8px',
});

const TypingIndicator = styled(motion.div)({
  padding: '12px 16px',
  borderRadius: '20px',
  backgroundColor: '#e0e0e0',
  alignSelf: 'flex-start',
  display: 'flex',
  gap: '4px',
  marginBottom: '10px',
});

const TypingDot = styled(motion.div)({
  width: '8px',
  height: '8px',
  backgroundColor: '#666',
  borderRadius: '50%',
});

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "start",
      text: "Hello! I'm here to help you learn. What would you like to know today?",
      isUser: false,
      timestamp: new Date(),
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
      text: "I'm here to help you learn! What would you like to know about?",
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
      text: 'Here\'s my drawing!',
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
        text: "That's a great drawing! I'd love to help you learn more about what you've drawn.",
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

  return (
    <ChatContainer>
      <MessageList ref={messageListRef}>
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              isUser={message.isUser}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {message.text}
              {message.drawing && (
                <DrawingImage src={message.drawing} alt="User drawing" />
              )}
              <Timestamp>
              {message.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Timestamp>
            </MessageBubble>
          ))}
          {isTyping && (
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
          )}
        </AnimatePresence>
      </MessageList>

      {showDrawingCanvas ? (
        <DrawingCanvas 
          onDrawingComplete={handleDrawingComplete} 
          onCancel={handleDrawingCancel}
        />
      ) : (
        <InputContainer elevation={3}>
          <TextField
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
            <span>
              <IconButton 
                color="primary" 
                onClick={() => setShowDrawingCanvas(true)}
                disabled={isTyping}
              >
                <BrushIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Send Message">
            <span>
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={isTyping || !inputText.trim()}
              >
                <SendIcon />
              </IconButton>
            </span>
          </Tooltip>
        </InputContainer>
      )}
    </ChatContainer>
  );
};

export default ChatInterface; 