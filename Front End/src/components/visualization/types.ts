// Interface for node and concept types
export interface Node {
  id: number;
  label: string;
  connections?: number[]; // Array of Node IDs that this node is connected to
}

export interface Concept {
  id: number;
  title: string;
  progress: number;
  nodes: Node[];
}

export interface VisualizationPaneProps {
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
} 