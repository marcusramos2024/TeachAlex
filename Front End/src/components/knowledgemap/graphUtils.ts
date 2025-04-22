import { Node } from './types';

// Check if nodes are overlapping in the position map
export const areNodesOverlapping = (
  node1Id: number,
  node2Id: number,
  positions: Map<number, { x: number, y: number }>,
  containerWidth: number,
  containerHeight: number
) => {
  const pos1 = positions.get(node1Id);
  const pos2 = positions.get(node2Id);
  
  if (!pos1 || !pos2) return false;
  
  // Convert normalized coordinates to pixels
  const node1X = pos1.x * containerWidth;
  const node1Y = pos1.y * containerHeight;
  const node2X = pos2.x * containerWidth;
  const node2Y = pos2.y * containerHeight;
  
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
  nodeIds: number[], 
  positions: Map<number, { x: number, y: number }>,
  containerWidth: number, 
  containerHeight: number
): Map<number, { x: number, y: number }> => {
  const adjustmentFactor = containerWidth < 600 ? 0.08 : 0.05; // Increase spacing on smaller screens
  const newPositions = new Map(positions);
  
  for (let i = 0; i < nodeIds.length; i++) {
    for (let j = i + 1; j < nodeIds.length; j++) {
      if (areNodesOverlapping(nodeIds[i], nodeIds[j], positions, containerWidth, containerHeight)) {
        const pos1 = positions.get(nodeIds[i]);
        const pos2 = positions.get(nodeIds[j]);
        
        if (!pos1 || !pos2) continue;
        
        // Calculate direction to push
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        const angle = Math.atan2(dy, dx);
        
        // Calculate distance to determine push strength
        const distance = Math.sqrt(dx * dx + dy * dy);
        const pushStrength = adjustmentFactor * (1.5 / (distance + 0.1)); // Stronger push for closer nodes
        
        // Move both nodes in opposite directions to better distribute the force
        const boundaryMargin = 0.15;
        
        // Move second node away
        const newPos2X = Math.min(Math.max(pos2.x + (Math.cos(angle) * pushStrength), boundaryMargin), 1 - boundaryMargin);
        const newPos2Y = Math.min(Math.max(pos2.y + (Math.sin(angle) * pushStrength), boundaryMargin), 1 - boundaryMargin);
        
        // Move first node in opposite direction, but with less force
        const newPos1X = Math.min(Math.max(pos1.x - (Math.cos(angle) * pushStrength * 0.5), boundaryMargin), 1 - boundaryMargin);
        const newPos1Y = Math.min(Math.max(pos1.y - (Math.sin(angle) * pushStrength * 0.5), boundaryMargin), 1 - boundaryMargin);
        
        newPositions.set(nodeIds[j], { x: newPos2X, y: newPos2Y });
        newPositions.set(nodeIds[i], { x: newPos1X, y: newPos1Y });
      }
    }
  }
  
  return newPositions;
}; 