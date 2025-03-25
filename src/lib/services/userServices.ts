'use server';
import { getCurrentUser } from '../auth';
import UserModel from '../mongo/models/UserModel';
import CourseModel from '../mongo/models/CourseModel';
import { destroyCourse } from './util';
import mongoDb from '../mongo/db';

export const destroyAccount = async () => {
  await mongoDb();

  const authUser = await getCurrentUser();
  if (!authUser) {
    throw new Error('User not found');
  }

  const user = await UserModel.findById(authUser.id);
  if (!user) {
    throw new Error('User not found');
  }

  const courses = await CourseModel.find({ user: authUser.id }).lean();

  for (const course of courses) {
    try {
      await destroyCourse(course._id.toString());
    } catch (error) {
      console.error('Error deleting course', error);
      throw new Error('Error deleting course');
    }
  }

  await UserModel.findByIdAndDelete(user._id);
};
