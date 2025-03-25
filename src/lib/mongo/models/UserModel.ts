import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export interface UserInput {
  email: string;
  name: string;
  image: string;
  password?: string;
  emailVerified?: boolean;
  verificationSecretToken: string;
}

export interface User extends UserInput, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: false },
    password: { type: String, required: false },
    emailVerified: { type: Boolean, default: false },
    verificationSecretToken: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const UserModel: Model<User> = mongoose.models?.User || mongoose.model<User>('User', userSchema, 'User');

export { userSchema };

export default UserModel;
