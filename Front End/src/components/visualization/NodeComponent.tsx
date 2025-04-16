import { MouseEvent } from 'react';
import { Node } from './types';
import { NodeItem } from './StyledComponents';

interface NodeComponentProps {
  node: Node;
  isDragging: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseDown: (e: MouseEvent) => void;
}

const NodeComponent = ({ 
  node, 
  isDragging, 
  onMouseEnter, 
  onMouseLeave, 
  onMouseDown 
}: NodeComponentProps) => {
  return (
    <NodeItem
      key={node.id}
      isActive={node.isActive}
      isDragging={isDragging}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
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