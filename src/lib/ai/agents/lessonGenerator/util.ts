import CourseModel, { Course, CourseDocument, Lesson } from '@/lib/mongo/models/CourseModel';
import crypto from 'crypto';

type GetResources = (props: { uxId: string; moduleId: string; lessonId: string }) => Promise<{
  course: CourseDocument;
  targetModule: Course['modules']['roadmap'][0];
  targetLesson: Lesson;
}>;

export const getResources: GetResources = async ({ uxId, moduleId, lessonId }) => {
  const course = (await CourseModel.findOne({ uxId })) as CourseDocument;
  if (!course || !moduleId) {
    throw new Error('Course or moduleId not found');
  }

  const targetModule = course.modules.roadmap.find((module) => module.id === moduleId);
  if (!targetModule) {
    throw new Error(`Module with ID ${moduleId} not found in course roadmap`);
  }

  // @ts-ignore
  const targetLesson = targetModule.lessons.find((el) => el._id.toString() === lessonId);
  if (!targetLesson) {
    throw new Error(`Lesson with ID ${lessonId} not found in module ${moduleId}`);
  }

  return {
    course,
    targetModule,
    targetLesson,
  };
};

export const genHashId = (value: string): string => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
