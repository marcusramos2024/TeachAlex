import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, styled, Slider, Tooltip, Popover, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPaintBrush,
  faEraser,
  faTrash,
  faPalette,
  faTimes,
  faPaperPlane,
  faTextHeight
} from '@fortawesome/free-solid-svg-icons';

interface DrawingCanvasProps {
  onDrawingComplete: (dataUrl: string) => void;
  onCancel: () => void;
}

const CanvasContainer = styled(Paper)({
  padding: '16px',
  margin: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  backgroundColor: '#ffffff',
  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.03)',
  borderRadius: '0',
});

const CanvasHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '8px',
});

const Toolbar = styled(Box)({
  display: 'flex',
  gap: '12px',
  padding: '12px 16px',
  backgroundColor: '#f5f7fa',
  borderRadius: '10px',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
});

const ToolGroup = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const Canvas = styled('canvas')({
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '8px',
  cursor: 'crosshair',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
});

const ColorPicker = styled('input')({
  width: '32px',
  height: '32px',
  padding: '0',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  '&::-webkit-color-swatch-wrapper': {
    padding: '0',
  },
  '&::-webkit-color-swatch': {
    border: 'none',
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
});

const ColorPopover = styled(Popover)({
  '& .MuiPopover-paper': {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
  },
});

const SizePopover = styled(Popover)({
  '& .MuiPopover-paper': {
    padding: '16px',
    width: '240px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
  },
});

const ToolButton = styled(IconButton)(({ active }: { active?: boolean }) => ({
  backgroundColor: active ? '#e7f0ff' : '#f5f7fa',
  color: active ? '#2466cc' : '#5f6368',
  padding: '8px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: active ? '#d4e4ff' : '#e8eaed',
  },
}));

const ActionButton = styled(IconButton)<{ isSubmit?: boolean }>(({ isSubmit }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  backgroundColor: isSubmit ? '#2466cc' : '#f5f7fa',
  color: isSubmit ? '#ffffff' : '#5f6368',
  '&:hover': {
    backgroundColor: isSubmit ? '#1a4fa0' : '#e8eaed',
  },
}));

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
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(36, 102, 204, 0.16)',
    },
    '&:before': {
      display: 'none',
    },
  },
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
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sizeAnchorEl, setSizeAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 350;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing styles
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setContext(ctx);
  }, []); // Only run once on mount

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
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = context;
    if (!canvas || !ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onDrawingComplete(dataUrl);
    clearCanvas();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    handleColorClose();
  };

  const handleBrushSizeChange = (_: Event, value: number | number[]) => {
    const size = value as number;
    setBrushSize(size);
  };

  const handleColorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColorAnchorEl(event.currentTarget);
  };

  const handleSizeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSizeAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchorEl(null);
  };

  const handleSizeClose = () => {
    setSizeAnchorEl(null);
  };

  const colorOpen = Boolean(colorAnchorEl);
  const sizeOpen = Boolean(sizeAnchorEl);

  // Color presets
  const colorPresets = [
    '#2466cc', // Blue
    '#14ae5c', // Green
    '#d93025', // Red
    '#9334e6', // Purple
    '#ff6d01', // Orange
    '#000000', // Black
  ];

  return (
    <CanvasContainer elevation={0}>
      <CanvasHeader>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Drawing Canvas
        </Typography>
      </CanvasHeader>
      
      <Toolbar>
        <ToolGroup>
          <Tooltip title="Brush">
            <ToolButton 
              onClick={() => setIsEraser(false)}
              active={!isEraser}
              size="small"
            >
              <FontAwesomeIcon icon={faPaintBrush} />
            </ToolButton>
          </Tooltip>
          <Tooltip title="Eraser">
            <ToolButton 
              onClick={() => setIsEraser(true)} 
              active={isEraser}
              size="small"
            >
              <FontAwesomeIcon icon={faEraser} />
            </ToolButton>
          </Tooltip>
          <Tooltip title="Color">
            <ToolButton onClick={handleColorClick} size="small">
              <FontAwesomeIcon icon={faPalette} style={{ color: isEraser ? '#5f6368' : color }} />
            </ToolButton>
          </Tooltip>
          <Tooltip title="Brush Size">
            <ToolButton onClick={handleSizeClick} size="small">
              <FontAwesomeIcon icon={faTextHeight} />
            </ToolButton>
          </Tooltip>
          <Tooltip title="Clear Canvas">
            <ToolButton onClick={clearCanvas} size="small">
              <FontAwesomeIcon icon={faTrash} />
            </ToolButton>
          </Tooltip>
        </ToolGroup>
        
        <ToolGroup>
          <Tooltip title="Cancel">
            <ActionButton onClick={onCancel} size="small">
              <FontAwesomeIcon icon={faTimes} />
              <Typography sx={{ ml: 1, fontSize: '0.875rem' }}>Cancel</Typography>
            </ActionButton>
          </Tooltip>
          <Tooltip title="Send Drawing">
            <ActionButton onClick={handleSave} isSubmit size="small">
              <FontAwesomeIcon icon={faPaperPlane} />
              <Typography sx={{ ml: 1, fontSize: '0.875rem' }}>Send</Typography>
            </ActionButton>
          </Tooltip>
        </ToolGroup>
      </Toolbar>

      <Canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />

      <ColorPopover
        open={colorOpen}
        anchorEl={colorAnchorEl}
        onClose={handleColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Select Color
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {colorPresets.map((presetColor) => (
            <Box
              key={presetColor}
              onClick={() => {
                setColor(presetColor);
                handleColorClose();
              }}
              sx={{
                width: 32,
                height: 32,
                backgroundColor: presetColor,
                borderRadius: '50%',
                cursor: 'pointer',
                border: color === presetColor ? '2px solid #2466cc' : '2px solid transparent',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s',
              }}
            />
          ))}
        </Box>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
            Custom Color
          </Typography>
          <ColorPicker
            type="color"
            value={color}
            onChange={handleColorChange}
          />
        </Box>
      </ColorPopover>

      <SizePopover
        open={sizeOpen}
        anchorEl={sizeAnchorEl}
        onClose={handleSizeClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Brush Size: {brushSize}px
        </Typography>
        <StyledSlider
          value={brushSize}
          onChange={handleBrushSizeChange}
          min={1}
          max={20}
          onChangeCommitted={handleSizeClose}
        />
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 1,
          fontSize: '0.75rem',
          color: '#5f6368'
        }}>
          <span>Fine</span>
          <span>Medium</span>
          <span>Thick</span>
        </Box>
      </SizePopover>
    </CanvasContainer>
  );
};

export default DrawingCanvas; 