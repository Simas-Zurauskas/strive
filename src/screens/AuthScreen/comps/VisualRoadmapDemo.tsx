import React from 'react';
import dynamic from 'next/dynamic';
import { Edge } from 'reactflow';
import type { Course } from '@/lib/mongo/models/CourseModel';

// Dynamically import FlowEdit with no SSR to avoid hydration issues
const FlowEdit = dynamic(() => import('@/components/Flow/FlowEdit'), { ssr: false });

// Demo data for the roadmap visualization - Data Science & AI Career Path
// Using type assertion for demo purposes since we don't need complete data model implementation
const demoModules = [
  {
    id: 'foundations',
    title: 'Data Science Foundations',
    description: 'Math concepts for data science: statistics, linear algebra, and calculus for ML algorithms.',
    longDescription:
      'Learn the fundamental mathematical concepts that power data science and machine learning. This module covers statistics, linear algebra, and calculus, providing you with the mathematical toolkit needed for advanced techniques. You will develop the ability to understand the math behind algorithms and models. These foundational skills will enhance your ability to interpret results and optimize models.',
    isRequired: true,
    level: 1,
    estimatedHours: 5,
    completedHours: 5,
    lessons: [
      { id: 'l1', title: 'Statistics Fundamentals', isCompleted: true },
      { id: 'l2', title: 'Linear Algebra Basics', isCompleted: true },
      { id: 'l3', title: 'Calculus for ML', isCompleted: true },
    ],
    chat: { messages: [] },
  },
  {
    id: 'python',
    title: 'Python for Data Science',
    description: 'Python for data analysis and ML. Learn syntax, data structures, and OOP for implementing algorithms.',
    longDescription:
      'Master Python programming for data analysis and machine learning applications. You will learn syntax, data structures, and object-oriented programming to manipulate and analyze data efficiently. This module emphasizes practical coding skills through hands-on exercises with popular data science libraries. You will build a solid programming foundation essential for implementing complex machine learning algorithms.',
    isRequired: true,
    level: 1,
    estimatedHours: 7,
    completedHours: 7,
    lessons: [
      { id: 'l4', title: 'Python Syntax', isCompleted: true },
      { id: 'l5', title: 'Data Structures', isCompleted: true },
      { id: 'l6', title: 'Functions & OOP', isCompleted: true },
      { id: 'l7', title: 'Python Libraries for Data Science', isCompleted: true },
      { id: 'l8', title: 'Effective Python Coding', isCompleted: true },
    ],
    chat: { messages: [] },
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis & Visualization',
    description: 'Clean and visualize data with pandas and matplotlib. Extract insights and communicate results.',
    longDescription:
      'Learn how to analyze and visualize data using pandas, matplotlib, and seaborn. This module covers techniques for cleaning, processing, and extracting insights from datasets of various types and sizes. You will master the art of creating compelling visualizations that effectively communicate patterns and trends. These skills are crucial for exploratory data analysis and presenting findings to stakeholders.',
    isRequired: true,
    level: 2,
    estimatedHours: 7,
    completedHours: 6,
    lessons: [
      { id: 'l9', title: 'Pandas Fundamentals', isCompleted: true },
      { id: 'l10', title: 'Data Cleaning', isCompleted: true },
      { id: 'l11', title: 'Visualization with Matplotlib', isCompleted: true },
      { id: 'l12', title: 'Advanced Visualizations', isCompleted: false },
      { id: 'l13', title: 'Exploratory Data Analysis', isCompleted: true },
      { id: 'l14', title: 'Interactive Dashboards', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning Fundamentals',
    description:
      'Core algorithms for predictive models. Master supervised and unsupervised techniques with proper evaluation.',
    longDescription:
      'Understand the fundamental concepts and algorithms of machine learning. You will explore supervised and unsupervised learning techniques, along with methods for evaluating model performance and tuning hyperparameters. This module builds your ability to select appropriate algorithms for different types of problems. You will implement and compare various techniques on real-world datasets to gain practical experience.',
    isRequired: true,
    level: 3,
    estimatedHours: 7,
    completedHours: 4,
    lessons: [
      { id: 'l15', title: 'Supervised Learning', isCompleted: true },
      { id: 'l16', title: 'Unsupervised Learning', isCompleted: true },
      { id: 'l17', title: 'Model Evaluation', isCompleted: false },
      { id: 'l18', title: 'Feature Engineering', isCompleted: false },
      { id: 'l19', title: 'Ensemble Methods', isCompleted: true },
      { id: 'l20', title: 'Dimensionality Reduction', isCompleted: false },
      { id: 'l21', title: 'ML Model Deployment Basics', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Neural networks for complex problems. Study CNNs, RNNs, and Transformers for implementing solutions.',
    longDescription:
      'Explore neural networks and deep learning architectures for solving complex problems. This module covers the theory behind neural networks, from basic perceptrons to advanced architectures like CNNs, RNNs, and Transformers. You will implement these models using modern frameworks to tackle image, text, and sequential data problems. Gain hands-on experience training and optimizing deep learning models for various applications.',
    isRequired: true,
    level: 4,
    estimatedHours: 7,
    completedHours: 0,
    lessons: [
      { id: 'l22', title: 'Neural Network Fundamentals', isCompleted: false },
      { id: 'l23', title: 'CNNs for Computer Vision', isCompleted: false },
      { id: 'l24', title: 'RNNs for Sequence Data', isCompleted: false },
      { id: 'l25', title: 'Transformers & Attention', isCompleted: false },
      { id: 'l26', title: 'Transfer Learning', isCompleted: false },
      { id: 'l27', title: 'Generative Models', isCompleted: false },
      { id: 'l28', title: 'Deep Learning Optimization', isCompleted: false },
      { id: 'l29', title: 'Model Deployment at Scale', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    description: 'Process human language data. Learn preprocessing, embeddings, and models using BERT and GPT.',
    longDescription:
      'Learn techniques for processing and analyzing natural language data. This module covers text preprocessing, word embeddings, and language models that enable machines to understand human language. You will explore applications like sentiment analysis, text classification, and machine translation. Advanced topics include transformer-based models like BERT and GPT that have revolutionized NLP capabilities.',
    isRequired: false,
    level: 5,
    estimatedHours: 7,
    completedHours: 0,
    lessons: [
      { id: 'l30', title: 'Text Preprocessing', isCompleted: false },
      { id: 'l31', title: 'Word Embeddings', isCompleted: false },
      { id: 'l32', title: 'Language Models', isCompleted: false },
      { id: 'l33', title: 'Transformer Architectures', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    description: 'Analyze images and videos. Master image processing, object detection, and segmentation techniques.',
    longDescription:
      'Learn techniques for analyzing and understanding images and videos. This module covers fundamental concepts like image processing, feature extraction, and object detection using both traditional and deep learning approaches. You will implement algorithms for tasks such as image classification, segmentation, and facial recognition. Applications range from autonomous vehicles to medical image analysis and augmented reality.',
    isRequired: false,
    level: 5,
    estimatedHours: 7,
    completedHours: 0,
    lessons: [
      { id: 'l34', title: 'Image Processing', isCompleted: false },
      { id: 'l35', title: 'Object Detection', isCompleted: false },
      { id: 'l36', title: 'Image Segmentation', isCompleted: false },
      { id: 'l37', title: 'Face Recognition', isCompleted: false },
      { id: 'l38', title: 'Video Analysis', isCompleted: false },
      { id: 'l39', title: 'GANs for Image Generation', isCompleted: false },
      { id: 'l40', title: 'Image Classification Advanced', isCompleted: false },
      { id: 'l41', title: 'Instance Segmentation', isCompleted: false },
      { id: 'l42', title: 'Pose Estimation', isCompleted: false },
      { id: 'l43', title: 'Medical Image Analysis', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'reinforcement',
    title: 'Reinforcement Learning',
    description: 'Train AI agents with rewards. Study Markov processes, Q-learning, and policy optimization.',
    longDescription:
      'Learn how to train AI agents through reward-based reinforcement learning. This module covers the mathematical foundations of RL, including Markov decision processes, value functions, and policy optimization. You will implement algorithms like Q-learning and policy gradients to solve complex decision-making problems. Applications include game playing, robotics, recommendation systems, and resource management.',
    isRequired: false,
    level: 5,
    estimatedHours: 6,
    completedHours: 0,
    lessons: [
      { id: 'l44', title: 'RL Fundamentals', isCompleted: false },
      { id: 'l45', title: 'Q-Learning', isCompleted: false },
      { id: 'l46', title: 'Policy Gradients', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'mlops',
    title: 'MLOps & Deployment',
    description: 'Deploy ML models to production. Learn versioning, monitoring, and scaling for robust systems.',
    longDescription:
      'Learn how to deploy and maintain machine learning models in production. This module covers the entire ML lifecycle, including versioning, continuous integration, monitoring, and scaling of ML applications. You will explore cloud platforms and containerization for robust deployment of your models. Best practices for model governance, security, and performance optimization will prepare you for real-world industry applications.',
    isRequired: true,
    level: 6,
    estimatedHours: 6,
    completedHours: 0,
    lessons: [
      { id: 'l47', title: 'Model Deployment', isCompleted: false },
      { id: 'l48', title: 'Model Monitoring', isCompleted: false },
      { id: 'l49', title: 'CI/CD for ML', isCompleted: false },
      { id: 'l50', title: 'Containerization', isCompleted: false },
      { id: 'l51', title: 'Cloud Deployment Solutions', isCompleted: false },
    ],
    chat: { messages: [] },
  },
  {
    id: 'capstone',
    title: 'Capstone Project',
    description: 'Build a real-world ML application. Apply concepts across the entire development lifecycle.',
    longDescription:
      'Apply your skills to build a complete, real-world machine learning application. This project-based module guides you through all stages of ML development, from problem formulation to deployment and maintenance. You will integrate concepts from multiple domains to solve a complex problem of your choice. This capstone demonstrates your ability to deliver end-to-end ML solutions and showcases your portfolio to potential employers.',
    isRequired: true,
    level: 7,
    estimatedHours: 7,
    completedHours: 0,
    lessons: [
      { id: 'l52', title: 'Project Planning', isCompleted: false },
      { id: 'l53', title: 'Data Collection & Analysis', isCompleted: false },
      { id: 'l54', title: 'Model Development', isCompleted: false },
      { id: 'l55', title: 'Deployment & Presentation', isCompleted: false },
      { id: 'l56', title: 'Testing & Validation', isCompleted: false },
      { id: 'l57', title: 'Performance Optimization', isCompleted: false },
      { id: 'l58', title: 'UI/UX Development', isCompleted: false },
      { id: 'l59', title: 'Documentation', isCompleted: false },
      { id: 'l60', title: 'Final Presentation', isCompleted: false },
    ],
    chat: { messages: [] },
  },
] as unknown as Course['modules']['roadmap'];

// Edge connections between modules
const demoEdges: Edge[] = [
  // Core path connections
  { id: 'e1', source: 'foundations', target: 'data-analysis', animated: false },
  { id: 'e2', source: 'python', target: 'data-analysis', animated: false },
  { id: 'e3', source: 'data-analysis', target: 'ml-basics', animated: false },
  { id: 'e4', source: 'ml-basics', target: 'deep-learning', animated: false },
  { id: 'e5', source: 'deep-learning', target: 'mlops', animated: false },
  { id: 'e6', source: 'mlops', target: 'capstone', animated: false },

  // Optional specialization paths
  { id: 'e7', source: 'deep-learning', target: 'nlp', animated: false },
  { id: 'e8', source: 'deep-learning', target: 'computer-vision', animated: false },
  { id: 'e9', source: 'deep-learning', target: 'reinforcement', animated: false },

  // Optional paths to capstone
  { id: 'e10', source: 'nlp', target: 'capstone', animated: false },
  { id: 'e11', source: 'computer-vision', target: 'capstone', animated: false },
  { id: 'e12', source: 'reinforcement', target: 'capstone', animated: false },
];

export const VisualRoadmapDemo = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-amber-50 mb-4">
          Your Learning Journey Visualized
        </h2>
        <p className="text-lg text-gray-700 dark:text-amber-200/80 max-w-3xl mx-auto">
          Strive creates structured roadmaps with interconnected modules, showing you a clear path to mastery.
        </p>
        <div className="mt-4 max-w-2xl mx-auto">
          <p className="text-sm md:text-base text-gray-600 dark:text-amber-200/60">
            Interactive learning roadmaps guide you through your courses with a clear visual progression. Track your
            progress, understand dependencies, and know exactly what to learn next.
          </p>
        </div>
      </div>

      {/* Interactive roadmap demo using the actual Flow component */}
      <div className="relative bg-white/80 dark:bg-black/60 border border-amber-200/30 dark:border-amber-500/20 rounded-2xl backdrop-blur-sm shadow-lg overflow-hidden">
        <div className="w-full">
          <FlowEdit initialNodes={demoModules} edges={demoEdges} showLessonsProgress={true} />
        </div>
      </div>
    </div>
  );
};
