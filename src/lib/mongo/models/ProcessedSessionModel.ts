import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export interface ProcessedSessionInput {
  sessionId: string;
  userEmail: string;
  credits: number;
  processed: boolean;
}

export interface ProcessedSession extends ProcessedSessionInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const processedSessionSchema = new Schema<ProcessedSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true },
    credits: { type: Number, required: true },
    processed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const ProcessedSessionModel: Model<ProcessedSession> =
  mongoose.models?.ProcessedSession ||
  mongoose.model<ProcessedSession>('ProcessedSession', processedSessionSchema, 'ProcessedSession');

export default ProcessedSessionModel;
