import { MouseEvent } from 'react';
import { Node } from './types';
import { NodeItem } from './StyledComponents';

interface NodeComponentProps {
  node: Node;
  position: { x: number, y: number };
  isDragging: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: (e: MouseEvent) => void;
}

const NodeComponent = ({ 
  node, 
  position,
  isDragging, 
  onMouseEnter, 
  onMouseLeave, 
  onMouseDown 
}: NodeComponentProps) => {
  return (
    <NodeItem
      key={node.id}
      isDragging={isDragging}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
      {node.label}
    </NodeItem>
  );
};

export default NodeComponent; 