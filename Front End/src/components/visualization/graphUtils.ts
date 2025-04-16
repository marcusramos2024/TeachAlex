import { Node } from './types';

// Check if nodes are overlapping
export const areNodesOverlapping = (
  node1: Node, 
  node2: Node, 
  containerWidth: number, 
  containerHeight: number
) => {
  // Convert percentage to pixels
  const node1X = (node1.x / 100) * containerWidth;
  const node1Y = (node1.y / 100) * containerHeight;
  const node2X = (node2.x / 100) * containerWidth;
  const node2Y = (node2.y / 100) * containerHeight;
  
  // Approximate node dimensions with responsive sizing
  const baseNodeWidth = Math.min(160, containerWidth * 0.2);
  const minDistance = baseNodeWidth * 0.8; // Allow some overlap
  
  const distance = Math.sqrt(
    Math.pow(node1X - node2X, 2) + 
    Math.pow(node1Y - node2Y, 2)
  );
  
  return distance < minDistance;
};

// Move overlapping nodes apart
export const resolveOverlap = (
  nodes: Node[], 
  containerWidth: number, 
  containerHeight: number
) => {
  const adjustmentFactor = containerWidth < 600 ? 8 : 5; // Increase spacing on smaller screens
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (areNodesOverlapping(nodes[i], nodes[j], containerWidth, containerHeight)) {
        // Calculate direction to push
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const angle = Math.atan2(dy, dx);
        
        // Move nodes apart with more space on smaller screens
        const boundaryMargin = containerWidth < 768 ? 20 : 15;
        nodes[j].x = Math.min(Math.max(nodes[j].x + (Math.cos(angle) * adjustmentFactor), boundaryMargin), 100 - boundaryMargin);
        nodes[j].y = Math.min(Math.max(nodes[j].y + (Math.sin(angle) * adjustmentFactor), boundaryMargin), 100 - boundaryMargin);
      }
    }
  }
  
  return nodes;
}; 