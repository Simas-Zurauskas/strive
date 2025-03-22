import { SimpleEdge } from '@/types';
import mongoose from 'mongoose';
export interface FormValues {
  _id?: mongoose.Types.ObjectId;
  uxId?: string;
  initial: {
    learningGoal: string;
    currentKnowledge: string;
  };
  details: {
    courseDescription: string;
    tags: string[];
    courseTitle: { value: string; override?: string };
    completionHours: { value: number; override?: number };
    difficultyLevel: { value: string; override?: string };
  };
  modules: {
    roadmap: {
      id: string;
      title: string;
      description: string;
      longDescription: string;
      isRequired: boolean;
      level: number;
      estimatedHours: number;
    }[];
    edges: SimpleEdge[];
  };
}
