import mongoose, { Document, Model } from 'mongoose';
import { Schema } from 'mongoose';

export interface UserInput {
  email: string;
  name: string;
  image: string;
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
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const UserModel: Model<User> = mongoose.models?.User || mongoose.model<User>('User', userSchema, 'User');

export { userSchema };

export default UserModel;
