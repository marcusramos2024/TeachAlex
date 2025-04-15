import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, styled, Slider, Tooltip, Popover } from '@mui/material';
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
  padding: '10px',
  margin: '10px 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

const Toolbar = styled(Box)({
  display: 'flex',
  gap: '10px',
  padding: '10px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ToolGroup = styled(Box)({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
});

const Canvas = styled('canvas')({
  border: '1px solid #ccc',
  borderRadius: '8px',
  cursor: 'crosshair',
});

const ColorPicker = styled('input')({
  width: '40px',
  height: '40px',
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
  },
});

const ColorPopover = styled(Popover)({
  '& .MuiPopover-paper': {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
});

const SizePopover = styled(Popover)({
  '& .MuiPopover-paper': {
    padding: '10px',
    width: '200px',
  },
});

const DrawingCanvas = ({ onDrawingComplete, onCancel }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sizeAnchorEl, setSizeAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 500;
    canvas.height = 300;

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  return (
    <CanvasContainer elevation={2}>
      <Toolbar>
        <ToolGroup>
          <Tooltip title="Clear Canvas">
            <IconButton onClick={clearCanvas} color="error">
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Color">
            <IconButton onClick={handleColorClick}>
              <FontAwesomeIcon icon={faPalette} style={{ color: color }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Brush Size">
            <IconButton onClick={handleSizeClick}>
              <FontAwesomeIcon icon={faTextHeight} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Brush">
            <IconButton 
              onClick={() => setIsEraser(false)}
              color={!isEraser ? "primary" : "default"}
            >
              <FontAwesomeIcon icon={faPaintBrush} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eraser">
            <IconButton 
              onClick={() => setIsEraser(!isEraser)} 
              color={isEraser ? "primary" : "default"}
            >
              <FontAwesomeIcon icon={faEraser} />
            </IconButton>
          </Tooltip>
        </ToolGroup>
        <ToolGroup>
          <Tooltip title="Cancel">
            <IconButton onClick={onCancel} color="error">
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Drawing">
            <IconButton onClick={handleSave} color="primary">
              <FontAwesomeIcon icon={faPaperPlane} />
            </IconButton>
          </Tooltip>
        </ToolGroup>
      </Toolbar>

      <ColorPopover
        open={colorOpen}
        anchorEl={colorAnchorEl}
        onClose={handleColorClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <ColorPicker
          type="color"
          value={color}
          onChange={handleColorChange}
        />
      </ColorPopover>

      <SizePopover
        open={sizeOpen}
        anchorEl={sizeAnchorEl}
        onClose={handleSizeClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Slider
          value={brushSize}
          onChange={handleBrushSizeChange}
          min={1}
          max={20}
          valueLabelDisplay="auto"
          orientation="vertical"
          sx={{ height: '150px', margin: '10px auto' }}
        />
      </SizePopover>

      <Canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
    </CanvasContainer>
  );
};

export default DrawingCanvas; 