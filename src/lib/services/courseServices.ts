'use server';
import { CPointer } from '@/types';
import { getCurrentUser } from '../auth';
import CourseModel, { ChatData, Course, CourseInput } from '../mongo/models/CourseModel';
import { serializeMongoDoc } from '../utils';
import { destroyCourse } from './util';
import mongoDb from '../mongo/db';

type Input = Omit<CourseInput, 'user' | 'uxId'>;

type SaveCourse = (params: { uxId?: string; user: string; course: Input }) => Promise<void>;

export const saveCourse: SaveCourse = async ({ uxId, user, course }) => {
  await mongoDb();

  const existingCourse = await CourseModel.findOne({ uxId });
  if (existingCourse) {
    await CourseModel.findByIdAndUpdate(existingCourse._id, course);
  } else {
    await CourseModel.create({ ...course, user, uxId });
  }
};

export const getCourse = async (uxId?: string | null): Promise<Course | null> => {
  await mongoDb();

  if (!uxId) return null;
  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id }).lean();

  return course ? (serializeMongoDoc(course) as unknown as Course) : null;
};

export const deleteCourse = async (uxId: string) => {
  await mongoDb();

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
  await mongoDb();

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
  await mongoDb();

  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id });
  if (!course) {
    throw new Error('Course not found');
  }

  course.favourite = favourite;
  await course.save();
};

type GetCourseChat = (params: CPointer) => Promise<ChatData>;

export const getCourseChat: GetCourseChat = async ({ uxId, module }) => {
  await mongoDb();

  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId, user: user?.id }).lean();

  if (!course) {
    throw new Error('Course not found');
  }

  if (!module?.moduleId) {
    console.log('ROOT');
    return serializeMongoDoc(course.chat || []) as ChatData;
  }

  if (!module.lessonId) {
    console.log('MODILE');
    const mod = course.modules.roadmap.find((el) => el.id === module.moduleId);
    return serializeMongoDoc(mod?.chat || []) as ChatData;
  }

  console.log('LESSON');
  const mod = course.modules.roadmap.find((el) => el.id === module.moduleId);
  // @ts-ignore
  const lesson = mod?.lessons.find((el) => el._id?.toString() === module.lessonId);
  return serializeMongoDoc(lesson?.chat || []) as ChatData;
};

type DeleteChat = (cPointer: CPointer) => Promise<void>;

export const deleteChat: DeleteChat = async (cPointer) => {
  await mongoDb();

  const user = await getCurrentUser();
  const course = await CourseModel.findOne({ uxId: cPointer.uxId, user: user?.id });

  if (!course) {
    throw new Error('Course not found');
  }

  if (!cPointer.module?.moduleId) {
    console.log('DELETE ROOT');
    course.chat = { summary: '', messages: [] };
  } else {
    const moduleObj = cPointer.module;
    const module = course.modules.roadmap.find((el) => el.id === moduleObj.moduleId);
    if (!module) {
      throw new Error('Module not found');
    }

    if (!moduleObj.lessonId) {
      console.log('DELETE MODULE');
      module.chat = { summary: '', messages: [] };
    } else {
      console.log('DELETE LESSON');

      // @ts-ignore
      const lesson = module.lessons.find((el) => el._id.toString() === moduleObj.lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      lesson.chat = { summary: '', messages: [] };
    }
  }

  await course.save();
};
