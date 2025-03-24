import { NodeFunction } from '../../types';
import { model } from '@/lib/ai/models';
import CourseModel from '@/lib/mongo/models/CourseModel';
import { convertToLangChainMessage, getDbHistory } from './util';
import { takeRight } from 'lodash';
import { getChatLevel } from '@/lib/utils';
import { coursePrompt, lessonPrompt, modulePrompt } from './prompts';
import { TOOLS } from '../../tools';

const promptsByContext = {
  course: coursePrompt,
  module: modulePrompt,
  lesson: lessonPrompt,
};

const llmWithTools = model.bindTools(TOOLS);

export const chatNode: NodeFunction = async (state) => {
  console.log('__NODE__ chatNode');
  try {
    const course = await CourseModel.findOne({ uxId: state.cPointer.uxId }).populate('modules.roadmap.lessons.content');

    if (!course) {
      throw new Error('Course not found');
    }

    const context = getChatLevel(state.cPointer);

    const prompt = promptsByContext[context];

    const dbHistory = await getDbHistory({ cPointer: state.cPointer, course });

    // console.log('DB HISTORY', dbHistory);

    const historyMessagesTrimmed = takeRight(dbHistory.map(convertToLangChainMessage), 10);
    const allMessages = [...historyMessagesTrimmed, ...state.messages];

    // console.log('ALL MESSAGES', allMessages);

    let contextData = {
      courseTitle: course.details.courseTitle.override || course.details.courseTitle.value,
      courseDescription: course.details.courseDescription,
      difficultyLevel: course.details.difficultyLevel,
      learningGoal: course.initial.learningGoal,
      currentKnowledge: course.initial.currentKnowledge,
      completionHours: course.details.completionHours,
      availableModules: JSON.stringify(
        course.modules.roadmap.map((el) => ({
          title: el.title,
          description: el.description,
          longDescription: el.longDescription,
          isRequired: el.isRequired,
          estimatedHours: el.estimatedHours,
          lessons: el.lessons.map((l) => ({
            title: l.title,
            description: l.description,
            durationMinutes: l.durationMinutes,
            isCompleted: l.isCompleted,
          })),
        })),
      ),
      // module
      currentModuleData: '',
      // lesson
      currentLessonData: '',
    };

    if (state.cPointer.module?.moduleId) {
      const module = course.modules.roadmap.find((m) => m.id === state.cPointer.module?.moduleId);

      if (!module) {
        throw new Error('Module not found');
      }

      const currentModuleData = JSON.stringify({
        title: module?.title,
        description: module?.description,
        longDescription: module?.longDescription,
        estimatedHours: module?.estimatedHours,
        isRequired: module.isRequired,
        lessons: module?.lessons.map((l) => ({
          title: l.title,
          description: l.description,
          durationMinutes: l.durationMinutes,
          isCompleted: l.isCompleted,
          // @ts-ignore
          summary: l?.content?.summary || '',
        })),
      });
      contextData.currentModuleData = currentModuleData;

      if (state.cPointer.module?.lessonId) {
        // @ts-ignore
        const lesson = module.lessons.find((l) => l._id.toString() === state.cPointer.module?.lessonId);

        if (!lesson) {
          throw new Error('Lesson not found');
        }

        const currentLessonData = JSON.stringify({
          title: lesson.title,
          description: lesson.description,
          durationMinutes: lesson.durationMinutes,
          isCompleted: lesson.isCompleted,
          // @ts-ignore
          summary: lesson?.content?.summary || '',
        });

        contextData.currentLessonData = currentLessonData;
      }
    }

    const response = await prompt.pipe(llmWithTools).invoke({
      messages: allMessages,
      ...contextData,
    });

    return {
      messages: [response],
    };
  } catch (error) {
    console.error('Error in chatNode:', error);
    return {
      messages: state.messages,
    };
  }
};
