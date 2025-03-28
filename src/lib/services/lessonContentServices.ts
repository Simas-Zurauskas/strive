'use server';
import { getCurrentUser } from '../auth';
import mongoDb from '../mongo/db';
import LessonContentModel, { LessonContent } from '../mongo/models/LessonContent';
import { serializeMongoDoc } from '../utils';

export const getLessonContent = async (id?: string | null) => {
  await mongoDb();

  if (!id) return null;
  const user = await getCurrentUser();

  const lessonContent = await LessonContentModel.findOne({ user: user?.id, _id: id }).lean();

  return serializeMongoDoc(lessonContent) as LessonContent | null;
};
