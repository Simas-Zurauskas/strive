import { SimpleEdge } from '@/types';
import { AxiosResponse } from 'axios';
export type ThenArgs<T> = T extends Promise<infer U> ? U : T;
export type AxiosArgs<T> = T extends AxiosResponse<infer U> ? U : undefined;

export type ApiResponse<T> = AxiosArgs<ThenArgs<AxiosResponse<T>>>;

export interface GenCourseResponse {
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
