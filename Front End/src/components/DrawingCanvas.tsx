import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, styled, Slider, Tooltip, Typography, Button, Fade } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import EraseIcon from '@mui/icons-material/BackspaceOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PaletteIcon from '@mui/icons-material/Palette';
import SendIcon from '@mui/icons-material/Send';
import UndoIcon from '@mui/icons-material/Undo';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { motion } from 'framer-motion';
import '@fontsource/montserrat/600.css';

interface DrawingCanvasProps {
  onDrawingComplete: (dataUrl: string) => void;
  onCancel: () => void;
}

// Predefined color palette
const colorPalette = [
  '#2e79ea', // Primary blue
  '#e53935', // Red
  '#43a047', // Green
  '#fb8c00', // Orange
  '#9c27b0', // Purple
  '#00acc1', // Teal
  '#3d5afe', // Indigo
  '#212121', // Black
];

const CanvasContainer = styled(Paper)({
  padding: '20px',
  margin: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
  borderRadius: '24px 24px 0 0',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2776e6 0%, #1e59b0 100%)',
  },
});

const CanvasHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '100%',
  marginBottom: '4px',
});

const Canvas = styled('canvas')({
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  width: '100%',
  maxWidth: '100%',
});

const DrawingArea = styled(Box)({
  display: 'flex',
  width: '100%',
  gap: '12px',
  alignItems: 'flex-start',
});

const VerticalToolbar = styled(motion.div)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '12px',
  backgroundColor: '#f5f7fa',
  borderRadius: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.06)',
});

const ColorButton = styled(Box)<{ isSelected: boolean; color: string }>(({ isSelected, color }) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  boxShadow: isSelected ? '0 0 0 2px white, 0 0 0 4px #2e79ea' : '0 2px 4px rgba(0,0,0,0.2)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.15)',
  },
}));

const ToolButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  backgroundColor: active ? '#e7f0ff' : '#ffffff',
  color: active ? '#2466cc' : '#5f6368',
  padding: '10px',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  border: active ? '1px solid rgba(36, 102, 204, 0.3)' : '1px solid rgba(0, 0, 0, 0.08)',
  '&:hover': {
    backgroundColor: active ? '#d4e4ff' : '#f5f7fa',
  },
}));

const ActionButton = styled(Button)<{ isSubmit?: boolean }>(({ isSubmit }) => ({
  borderRadius: '10px',
  padding: '8px 16px',
  fontWeight: 500,
  textTransform: 'none',
  boxShadow: isSubmit ? '0 4px 12px rgba(36, 102, 204, 0.25)' : 'none',
  '&:hover': {
    boxShadow: isSubmit ? '0 6px 16px rgba(36, 102, 204, 0.3)' : 'none',
  },
}));

const SizeIndicator = styled(Box)<{ size: number }>(({ size }) => ({
  width: `${size * 2}px`,
  height: `${size * 2}px`,
  backgroundColor: '#2466cc',
  borderRadius: '50%',
  marginRight: '8px',
}));

const BrushSizeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 16px',
  gap: '8px',
  width: '100%',
});

const ColorPaletteContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  justifyContent: 'center',
  padding: '12px',
});

const StyledSlider = styled(Slider)({
  color: '#2466cc',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0 0 0 8px rgba(36, 102, 204, 0.16)',
    },
  },
});

const ControlsBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0 8px',
});

const DrawingCanvas = ({ onDrawingComplete, onCancel }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [color, setColor] = useState('#2466cc');
  const [brushSize, setBrushSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showSizeSlider, setShowSizeSlider] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [canvasEmpty, setCanvasEmpty] = useState(true);

  // Custom brush cursor styles based on state
  const getCursorStyle = () => {
    if (isEraser) {
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize * 2 + 8}' height='${brushSize * 2 + 8}' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 20H7L3 16c-.8-.8-.8-2 0-2.8L13.8 2.4c.8-.8 2-.8 2.8 0L20 6c.8.8.8 2 0 2.8L8 20'/%3E%3C/svg%3E") ${brushSize + 4} ${brushSize + 4}, auto`;
    } else {
      return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${brushSize * 2 + 8}' height='${brushSize * 2 + 8}' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='12' r='${brushSize}' fill='${encodeURIComponent(color)}' opacity='0.6'/%3E%3Ccircle cx='12' cy='12' r='${brushSize}' stroke='%23000000' stroke-width='1' opacity='0.8'/%3E%3C/svg%3E") ${brushSize + 4} ${brushSize + 4}, auto`;
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set initial canvas size
    updateCanvasSize();

    // Add window resize listener to make canvas responsive
    window.addEventListener('resize', updateCanvasSize);

    // Set drawing styles
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setContext(ctx);
    
    // Save initial state for undo
    saveState();

    // Cleanup resize listener on unmount
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []); 

  // Function to update canvas size on window resize
  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parentWidth = canvas.parentElement?.clientWidth || 600;
    const height = Math.min(350, window.innerHeight * 0.4);
    canvas.width = Math.min(900, parentWidth - 70); // Adjusted for vertical toolbar, with a maximum width
    canvas.height = height;

    // Redraw content if context exists
    if (context) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      if (tempCtx && undoStack.length > 0) {
        const img = new Image();
        img.onload = () => {
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = undoStack[undoStack.length - 1];
      }
    } else {
      // If no context, fill with white
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Update drawing styles when they change
  useEffect(() => {
    if (!context) return;

    if (isEraser) {
      context.strokeStyle = '#ffffff';
    } else {
      context.strokeStyle = color;
    }
    context.lineWidth = brushSize;
  }, [color, brushSize, isEraser, context]);

  // Save the current state of the canvas for undo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const imageData = canvas.toDataURL('image/png');
    setUndoStack(prev => [...prev, imageData]);
  };

  // Handle undo operation
  const handleUndo = () => {
    if (undoStack.length <= 1) return;
    
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;
    
    // Remove current state
    const newStack = [...undoStack];
    newStack.pop();
    setUndoStack(newStack);
    
    // Get previous state
    const prevState = newStack[newStack.length - 1];
    
    // Load previous state
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Check if the canvas is empty
      checkIfCanvasEmpty();
    };
    img.src = prevState;
  };

  // Check if canvas is empty (all white)
  const checkIfCanvasEmpty = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let isEmpty = true;
    
    // Check for non-white pixels (checking every 20 pixels for performance)
    for (let i = 0; i < imageData.length; i += 80) {
      // If RGB values are all less than 255, it's not white
      if (imageData[i] < 255 || imageData[i + 1] < 255 || imageData[i + 2] < 255) {
        isEmpty = false;
        break;
      }
    }
    
    setCanvasEmpty(isEmpty);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState(); // Save state when stroke is complete
      checkIfCanvasEmpty();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save cleared state
    saveState();
    setCanvasEmpty(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onDrawingComplete(dataUrl);
  };

  const handleBrushClick = () => {
    setIsEraser(false);
  };

  const handleEraserClick = () => {
    setIsEraser(true);
  };

  const handleBrushSizeChange = (_: Event, value: number | number[]) => {
    setBrushSize(value as number);
  };

  const toggleColorPalette = () => {
    setShowColorPalette(!showColorPalette);
    setShowSizeSlider(false);
  };

  const toggleSizeSlider = () => {
    setShowSizeSlider(!showSizeSlider);
    setShowColorPalette(false);
  };

  // Handle touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();

    setLastX(x);
    setLastY(y);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  return (
    <CanvasContainer elevation={3}>
      <CanvasHeader>
        <IconButton onClick={onCancel} size="small">
          <CloseIcon />
        </IconButton>
      </CanvasHeader>

      <DrawingArea>
        <VerticalToolbar
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip title="Brush" placement="right">
            <ToolButton
              active={!isEraser}
              onClick={handleBrushClick}
            >
              <BrushIcon />
            </ToolButton>
          </Tooltip>
          
          <Tooltip title="Color" placement="right">
            <ToolButton 
              onClick={toggleColorPalette}
              sx={{ 
                border: `3px solid ${color}`,
                padding: '7px'
              }}
            >
              <PaletteIcon />
            </ToolButton>
          </Tooltip>
          
          <Tooltip title="Brush Size" placement="right">
            <ToolButton 
              onClick={toggleSizeSlider}
            >
              <LineWeightIcon />
            </ToolButton>
          </Tooltip>
          
          <Tooltip title="Eraser" placement="right">
            <ToolButton
              active={isEraser}
              onClick={handleEraserClick}
            >
              <EraseIcon />
            </ToolButton>
          </Tooltip>
          
          <Box sx={{ height: 16 }} /> {/* Spacer */}
          
          <Tooltip title="Undo" placement="right">
            <span>
              <ToolButton
                onClick={handleUndo}
                disabled={undoStack.length <= 1}
                sx={{ opacity: undoStack.length <= 1 ? 0.5 : 1 }}
              >
                <UndoIcon />
              </ToolButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Clear" placement="right">
            <span>
              <ToolButton
                onClick={clearCanvas}
                disabled={canvasEmpty}
                sx={{ opacity: canvasEmpty ? 0.5 : 1 }}
              >
                <DeleteIcon />
              </ToolButton>
            </span>
          </Tooltip>
        </VerticalToolbar>

        <Canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: getCursorStyle() }}
        />
      </DrawingArea>

      {/* Color palette */}
      <Fade in={showColorPalette}>
        <Box sx={{ width: '100%', mb: showColorPalette ? 2 : 0 }}>
          {showColorPalette && (
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Select Color
              </Typography>
              <ColorPaletteContainer>
                {colorPalette.map((paletteColor) => (
                  <ColorButton
                    key={paletteColor}
                    color={paletteColor}
                    isSelected={color === paletteColor}
                    onClick={() => setColor(paletteColor)}
                  />
                ))}
              </ColorPaletteContainer>
            </Paper>
          )}
        </Box>
      </Fade>

      {/* Brush size slider */}
      <Fade in={showSizeSlider}>
        <Box sx={{ width: '100%', mb: showSizeSlider ? 2 : 0 }}>
          {showSizeSlider && (
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                Brush Size
              </Typography>
              <BrushSizeContainer>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SizeIndicator size={brushSize} />
                  <Typography variant="body2">{brushSize}px</Typography>
                </Box>
                <StyledSlider
                  value={brushSize}
                  onChange={handleBrushSizeChange}
                  min={1}
                  max={20}
                  valueLabelDisplay="auto"
                />
              </BrushSizeContainer>
            </Paper>
          )}
        </Box>
      </Fade>

      <ControlsBar>
        <ActionButton
          variant="outlined"
          onClick={onCancel}
          startIcon={<CloseIcon />}
        >
          Cancel
        </ActionButton>
        
        <ActionButton
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={canvasEmpty}
          isSubmit
          startIcon={<SendIcon />}
          endIcon={<CheckCircleOutlineIcon />}
        >
          Save Drawing
        </ActionButton>
      </ControlsBar>
    </CanvasContainer>
  );
};

export default DrawingCanvas; 