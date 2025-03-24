import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export interface LessonContentInput {
  course: mongoose.Types.ObjectId;
  md: string;
  heroImageUrl: string;
  summary: string;
  vectorIds: string[];
}

export interface LessonContent extends LessonContentInput {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface LessonContentDocument extends LessonContentInput, Document {}

const lessonContentSchema = new Schema<LessonContent>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    md: { type: String, required: true },
    heroImageUrl: { type: String },
    summary: { type: String },
    vectorIds: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

const LessonContentModel: Model<LessonContentDocument> =
  mongoose.models?.LessonContent ||
  mongoose.model<LessonContent>('LessonContent', lessonContentSchema, 'LessonContent');

export { lessonContentSchema };

export default LessonContentModel;
