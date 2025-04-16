// Interface for node and concept types
export interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  isActive?: boolean;
}

export interface Connection {
  source: number;
  target: number;
}

export interface Concept {
  id: number;
  title: string;
  subtitle: string;
  progress: number;
  nodes: Node[];
  connections: Connection[];
}

export interface VisualizationPaneProps {
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
} 