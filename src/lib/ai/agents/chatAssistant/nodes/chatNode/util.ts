import CourseModel, { CourseDocument } from '@/lib/mongo/models/CourseModel';
import { PlainChatMessage } from './types';
import { CPointer } from '@/types';

type GetDbHistory = (props: { cPointer: CPointer; course: CourseDocument }) => Promise<PlainChatMessage[]>;

export const getDbHistory: GetDbHistory = async ({ cPointer, course }) => {
  // Retrieve history from the database
  let dbHistory: PlainChatMessage[] = [];

  if (!cPointer.module?.moduleId) {
    dbHistory = course.chat.messages;
  }
  if (cPointer.module?.moduleId) {
    const moduleObj = cPointer.module;

    if (moduleObj.lessonId) {
      const lesson = course.modules.roadmap
        .find((el) => el.id === moduleObj.moduleId)
        // @ts-ignore
        ?.lessons.find((el) => el.id === moduleObj.lessonId);
      dbHistory = lesson?.chat.messages || [];
    } else {
      const module = course.modules.roadmap.find((el) => el.id === moduleObj.moduleId);
      dbHistory = module?.chat.messages || [];
    }
  }

  return dbHistory;
};

type SaveChatHistory = (props: {
  cPointer: CPointer;
  course: CourseDocument;
  newMessages: PlainChatMessage[];
}) => Promise<void>;

export const saveChatHistory: SaveChatHistory = async ({ cPointer, course, newMessages }) => {
  if (!cPointer.module?.moduleId) {
    await course.updateOne({
      $push: {
        'chat.messages': { $each: newMessages },
      },
    });

    console.log('UPDATE ROOT');
  } else {
    const moduleObj = cPointer.module;

    if (!moduleObj.lessonId) {
      // UPDATE MODULE
      console.log('UPDATE MODULE');
      await CourseModel.findOneAndUpdate(
        {
          uxId: cPointer.uxId,
          'modules.roadmap.id': moduleObj.moduleId,
        },
        {
          $push: {
            'modules.roadmap.$.chat.messages': {
              $each: newMessages,
            },
          },
        },
      );
    } else {
      // UPDATE LESSON
      console.log('UPDATE LESSON');

      const moduleIndex = course.modules.roadmap.findIndex((m) => m.id === moduleObj.moduleId);
      if (moduleIndex === -1) {
        throw new Error(`Module with id ${moduleObj.moduleId} not found`);
      }

      const lessonIndex = course.modules.roadmap[moduleIndex].lessons.findIndex(
        // @ts-ignore - using id for consistency with the rest of the code
        (l) => l.id === moduleObj.lessonId || l.order.toString() === moduleObj.lessonId,
      );
      if (lessonIndex === -1) {
        throw new Error(`Lesson with id ${moduleObj.lessonId} not found in module ${moduleObj.moduleId}`);
      }

      await CourseModel.updateOne(
        { uxId: cPointer.uxId },
        {
          $push: {
            [`modules.roadmap.${moduleIndex}.lessons.${lessonIndex}.chat.messages`]: {
              $each: newMessages,
            },
          },
        },
      );
    }
  }
};
