'use server';
import { CPointer } from '@/types';
import { getCurrentUser } from '../auth';
import CourseModel, { ChatMessage, Course, CourseInput } from '../mongo/models/CourseModel';
import { serializeMongoDoc } from '../utils';
import { destroyCourse } from './util';

type Input = Omit<CourseInput, 'user' | 'uxId'>;

type SaveCourse = (params: { uxId?: string; user: string; course: Input }) => Promise<void>;

export const saveCourse: SaveCourse = async ({ uxId, user, course }) => {
  const existingCourse = await CourseModel.findOne({ uxId });
  if (existingCourse) {
    await CourseModel.findByIdAndUpdate(existingCourse._id, course);
  } else {
    await CourseModel.create({ ...course, user, uxId });
  }
};

export const getCourse = async (uxId?: string | null): Promise<Course | null> => {
  if (!uxId) return null;
  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id }).lean();

  return course ? (serializeMongoDoc(course) as unknown as Course) : null;
};

export const deleteCourse = async (uxId: string) => {
  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id });

  if (!course) {
    throw new Error('Course not found');
  }

  try {
    await destroyCourse(course._id.toString());
  } catch (error) {
    console.error('Error deleting course', error);
    throw new Error('Error deleting course');
  }
};

type CompleteLesson = (params: {
  uxId: string;
  moduleId: string;
  lessonId: string;
  isCompleted: boolean;
}) => Promise<void>;

export const completeLesson: CompleteLesson = async ({ uxId, moduleId, lessonId, isCompleted }) => {
  const user = await getCurrentUser();

  const course = await CourseModel.findOne({
    uxId,
    user: user?.id,
  });

  const module = course?.modules.roadmap.find((module) => module.id === moduleId);
  // @ts-ignore
  const lesson = module?.lessons.find((lesson) => lesson._id.toString() === lessonId);

  if (!course || !module || !lesson) {
    throw new Error('Course not found');
  }

  lesson.isCompleted = isCompleted;

  await course.save();
};

type FavouriteCourse = (params: { uxId: string; favourite: boolean }) => Promise<void>;

export const favouriteCourse: FavouriteCourse = async ({ uxId, favourite }) => {
  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id });
  if (!course) {
    throw new Error('Course not found');
  }

  course.favourite = favourite;
  await course.save();
};

type GetCourseChat = (params: CPointer) => Promise<ChatMessage[]>;

export const getCourseChat: GetCourseChat = async ({ uxId, module }) => {
  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id }).lean();

  if (!course) {
    throw new Error('Course not found');
  }

  if (!module?.moduleId) {
    console.log('ROOT', course.chat);
    return serializeMongoDoc(course.chat || []) as ChatMessage[];
  }

  if (!module.lessonId) {
    console.log('MODILE');
    const mod = course.modules.roadmap.find((el) => el.id === module.moduleId);
    return serializeMongoDoc(mod?.chat || []) as ChatMessage[];
  }

  console.log('LESSON');
  const mod = course.modules.roadmap.find((el) => el.id === module.moduleId);
  // @ts-ignore
  const lesson = mod?.lessons.find((el) => el._id?.toString() === module.lessonId);
  return serializeMongoDoc(lesson?.chat || []) as ChatMessage[];
};
