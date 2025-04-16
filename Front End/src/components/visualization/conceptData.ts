import { Concept } from './types';

export const initialConcepts: Concept[] = [
  {
    id: 1,
    title: "Neural Networks",
    subtitle: "Understanding Machine Learning Fundamentals",
    progress: 72,
    nodes: [
      { id: 1, label: "Neural Networks", x: 50, y: 50, isActive: true },
      { id: 2, label: "Backpropagation", x: 25, y: 20 },
      { id: 3, label: "Activation Functions", x: 75, y: 25 },
      { id: 4, label: "Loss Functions", x: 85, y: 70 },
      { id: 5, label: "Gradient Descent", x: 35, y: 80 },
      { id: 6, label: "Transfer Learning", x: 60, y: 85 },
    ],
    connections: [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 4 },
      { source: 1, target: 5 },
      { source: 2, target: 5 },
      { source: 3, target: 4 },
      { source: 1, target: 6 },
      { source: 4, target: 6 },
    ],
  },
  {
    id: 2,
    title: "Natural Language Processing",
    subtitle: "Text Understanding and Generation",
    progress: 45,
    nodes: [
      { id: 1, label: "Natural Language Processing", x: 50, y: 50, isActive: true },
      { id: 2, label: "Word Embeddings", x: 30, y: 25 },
      { id: 3, label: "Transformers", x: 70, y: 30 },
      { id: 4, label: "Attention Mechanism", x: 80, y: 65 },
      { id: 5, label: "Sequence Models", x: 30, y: 75 },
      { id: 6, label: "Text Classification", x: 55, y: 80 },
    ],
    connections: [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 1, target: 5 },
      { source: 3, target: 4 },
      { source: 5, target: 6 },
      { source: 2, target: 5 },
      { source: 3, target: 6 },
    ],
  },
  {
    id: 3,
    title: "Computer Vision",
    subtitle: "Image Understanding and Processing",
    progress: 58,
    nodes: [
      { id: 1, label: "Computer Vision", x: 50, y: 50, isActive: true },
      { id: 2, label: "Convolutional Networks", x: 25, y: 30 },
      { id: 3, label: "Image Classification", x: 75, y: 30 },
      { id: 4, label: "Object Detection", x: 80, y: 60 },
      { id: 5, label: "Image Segmentation", x: 35, y: 70 },
      { id: 6, label: "Feature Extraction", x: 60, y: 80 },
    ],
    connections: [
      { source: 1, target: 2 },
      { source: 1, target: 3 },
      { source: 2, target: 3 },
      { source: 3, target: 4 },
      { source: 1, target: 5 },
      { source: 2, target: 6 },
      { source: 6, target: 3 },
    ],
  },
  {
    id: 4,
    title: "Reinforcement Learning",
    subtitle: "Learning through Trial and Error",
    progress: 0,
    nodes: [],
    connections: []
  }
]; 