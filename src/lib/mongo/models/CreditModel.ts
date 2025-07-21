import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export interface CreditInput {
  email: string;
  value: number;
}

export interface Credit extends CreditInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const creditSchema = new Schema<Credit>(
  {
    email: { type: String, required: true, unique: true },
    value: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  },
);

const CreditModel: Model<Credit> = mongoose.models?.Credit || mongoose.model<Credit>('Credit', creditSchema, 'Credit');

export { creditSchema };

export default CreditModel;
