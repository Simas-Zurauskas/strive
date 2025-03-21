import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export enum DifficultyLevel {
  Foundation = 'Foundation',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface ChatMessage {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
}

export interface Lesson {
  order: number;
  title: string;
  description: string;
  durationMinutes: number;
  contentOutlineSpec: string;
  isCompleted?: boolean;
  content?: mongoose.Types.ObjectId;
  summary?: string;
  chat: ChatMessage[];
}

export interface CourseInput {
  uxId: string;
  user: mongoose.Types.ObjectId;
  favourite?: boolean;
  initial: {
    learningGoal: string;
    currentKnowledge: string;
  };
  details: {
    courseTitle: { value: string; override?: string };
    courseDescription: string;
    tags: string[];
    completionHours: { value: number; override?: number };
    difficultyLevel: { value: string; override?: string };
  };

  modules: {
    roadmap: {
      _id?: mongoose.Types.ObjectId;
      id: string;
      title: string;
      description: string;
      longDescription: string;
      isRequired: boolean;
      level: number;
      estimatedHours: number;
      lessons: Lesson[];
      chat: ChatMessage[];
    }[];
    edges: { id: string; source: string; target: string }[];
  };
  chat: ChatMessage[];
}

export interface Course extends CourseInput {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface CourseDocument extends CourseInput, Document {
  _id: mongoose.Types.ObjectId;
}

const ChatMessageSchema = new Schema<ChatMessage>({
  content: { type: String, required: true },
  role: { type: String, required: true },
});

const courseSchema = new Schema<Course>(
  {
    uxId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    favourite: { type: Boolean, default: false },
    initial: {
      learningGoal: { type: String, required: true },
      currentKnowledge: { type: String },
    },
    details: {
      courseTitle: {
        value: { type: String, required: true },
        override: { type: String },
      },
      courseDescription: { type: String, required: true },
      tags: { type: [String] },
      completionHours: {
        value: { type: Number, required: true },
        override: { type: Number },
      },
      difficultyLevel: {
        value: { type: String, required: true },
        override: { type: String },
      },
    },
    modules: {
      roadmap: {
        type: [
          {
            id: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            longDescription: { type: String, required: true },
            isRequired: { type: Boolean, required: true },
            level: { type: Number, required: true },
            estimatedHours: { type: Number, required: true },
            lessons: {
              type: [
                {
                  order: { type: Number, required: true },
                  title: { type: String, required: true },
                  description: { type: String, required: true },
                  durationMinutes: { type: Number, required: true },
                  contentOutlineSpec: { type: String, required: true },
                  isCompleted: { type: Boolean, default: false },
                  summary: { type: String },
                  content: { type: Schema.Types.ObjectId, ref: 'LessonContent' },
                },
              ],
              required: true,
            },
          },
        ],
        required: true,
      },
      edges: {
        type: [
          {
            id: { type: String, required: true },
            source: { type: String, required: true },
            target: { type: String, required: true },
          },
        ],
        required: true,
      },
    },
    chat: { type: [ChatMessageSchema], required: true },
  },
  {
    timestamps: true,
  },
);

const CourseModel: Model<CourseDocument> =
  mongoose.models?.Course || mongoose.model<Course>('Course', courseSchema, 'Course');

export { courseSchema };

export default CourseModel;
