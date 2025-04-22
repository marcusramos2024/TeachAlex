// Interface for node and concept types
export interface SubConcept {
  id: number;
  name: string;
  connections?: string[];
}

export interface Concept {
  id: number;
  name: string;
  progress: number;
  subConcepts: SubConcept[];
}

export interface VisualizationPaneProps {
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
} 