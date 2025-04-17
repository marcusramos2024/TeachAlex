import { Concept } from './types';

export const initialConcepts: Concept[] = [
  {
    id: 1,
    title: "Neural Networks",
    progress: 72,
    nodes: [
      { id: 1, label: "Neural Networks", connections: [2, 3, 4, 5, 6] },
      { id: 2, label: "Backpropagation", connections: [5] },
      { id: 3, label: "Activation Functions", connections: [4] },
      { id: 4, label: "Loss Functions", connections: [6] },
      { id: 5, label: "Gradient Descent", connections: [] },
      { id: 6, label: "Transfer Learning", connections: [] },
    ]
  },
  {
    id: 2,
    title: "Natural Language Processing",
    progress: 45,
    nodes: [
      { id: 1, label: "Natural Language Processing", connections: [2, 3, 5] },
      { id: 2, label: "Word Embeddings", connections: [5] },
      { id: 3, label: "Transformers", connections: [4, 6] },
      { id: 4, label: "Attention Mechanism", connections: [] },
      { id: 5, label: "Sequence Models", connections: [6] },
      { id: 6, label: "Text Classification", connections: [] },
    ]
  },
  {
    id: 3,
    title: "Computer Vision",
    progress: 58,
    nodes: [
      { id: 1, label: "Computer Vision", connections: [2, 3, 5] },
      { id: 2, label: "Convolutional Networks", connections: [3, 6] },
      { id: 3, label: "Image Classification", connections: [4] },
      { id: 4, label: "Object Detection", connections: [] },
      { id: 5, label: "Image Segmentation", connections: [] },
      { id: 6, label: "Feature Extraction", connections: [3] },
    ]
  },
  {
    id: 4,
    title: "Reinforcement Learning",
    progress: 0,
    nodes: []
  }
]; 