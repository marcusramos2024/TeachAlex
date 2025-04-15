export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  drawing?: string;
}

export interface DrawingCanvasProps {
  onDrawingComplete: (dataUrl: string) => void;
} 