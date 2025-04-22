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

export interface ExtractConceptsResponse {
  concepts: Array<{
    name: string;
    progress: number;
    subConcepts: Array<{
      name: string;
      connections: string[];
    }>;
  }>;
  initial_message: string;
}

export interface SendMessageResponse {
  response: string;
  concepts: Array<{
    name: string;
    progress: number;
    subConcepts: Array<{
      name: string;
      connections: string[];
    }>;
  }>;
}

// Custom event interface for concept updates
interface ConceptsUpdatedEvent {
  detail: {
    concepts: Array<{
      name: string;
      progress: number;
      subConcepts: Array<{
        name: string;
        connections: string[];
      }>;
    }>;
  };
}

// Extend the WindowEventMap to include our custom event
declare global {
  interface WindowEventMap {
    conceptsUpdated: CustomEvent<ConceptsUpdatedEvent['detail']>;
  }
} 