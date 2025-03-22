import { NodeFunction } from '../../types';
import { model } from '@/lib/ai/models';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import CourseModel, { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { getDbHistory, saveChatHistory } from './util';

type PlainChatMessage = Omit<ChatMessage, '_id'>;

const convertToLangChainMessage = (message: PlainChatMessage): BaseMessage => {
  return message.role === 'user' ? new HumanMessage(message.content) : new AIMessage(message.content);
};

const convertToSerializedMessage = (message: BaseMessage | PlainChatMessage): PlainChatMessage => {
  return {
    content: message.content.toString(),
    role: message instanceof HumanMessage ? 'user' : 'assistant',
  };
};

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    'system',
    'You are a mentor for a course. You are given a learning goal and you need to answer the question based on the learning goal. The learning goal is {learningGoal}',
  ],
  new MessagesPlaceholder('messages'),
]);

export const chatNode: NodeFunction = async (state) => {
  try {
    const course = await CourseModel.findOne({ uxId: state.cPointer.uxId });

    if (!course) {
      throw new Error('Course not found');
    }

    const dbHistory = await getDbHistory({ cPointer: state.cPointer, course });

    console.log('DB HISTORY', dbHistory);

    const historyMessages = dbHistory.map(convertToLangChainMessage);
    const allMessages = [...historyMessages, ...state.messages];

    console.log('ALL MESSAGES', allMessages);

    const response = await promptTemplate.pipe(model).invoke({
      messages: allMessages,
      learningGoal: course.initial.learningGoal,
    });

    const newMessages = [...state.messages, response].map(convertToSerializedMessage);

    console.log('NEW MESSAGES', newMessages);

    await saveChatHistory({ cPointer: state.cPointer, course, newMessages });

    // if (!state.cPointer.module?.moduleId) {
    //   await course.updateOne({
    //     $push: {
    //       chat: { $each: newMessages },
    //     },
    //   });

    //   console.log('UPDATE ROOT');
    // } else {
    //   const moduleObj = state.cPointer.module;

    //   if (moduleObj.lessonId) {
    //     console.log('UPDATE LESSON');

    //     const moduleIndex = course.modules.roadmap.findIndex((m) => m.id === moduleObj.moduleId);
    //     if (moduleIndex === -1) {
    //       throw new Error(`Module with id ${moduleObj.moduleId} not found`);
    //     }

    //     const lessonIndex = course.modules.roadmap[moduleIndex].lessons.findIndex(
    //       // @ts-ignore - using id for consistency with the rest of the code
    //       (l) => l.id === moduleObj.lessonId || l.order.toString() === moduleObj.lessonId,
    //     );
    //     if (lessonIndex === -1) {
    //       throw new Error(`Lesson with id ${moduleObj.lessonId} not found in module ${moduleObj.moduleId}`);
    //     }

    //     await CourseModel.updateOne(
    //       { uxId: state.cPointer.uxId },
    //       {
    //         $push: {
    //           [`modules.roadmap.${moduleIndex}.lessons.${lessonIndex}.chat`]: {
    //             $each: newMessages,
    //           },
    //         },
    //       },
    //     );
    //   } else {
    //     console.log('UPDATE MODULE');
    //     await CourseModel.findOneAndUpdate(
    //       {
    //         uxId: state.cPointer.uxId,
    //         'modules.roadmap.id': moduleObj.moduleId,
    //       },
    //       {
    //         $push: {
    //           'modules.roadmap.$.chat': {
    //             $each: newMessages,
    //           },
    //         },
    //       },
    //     );
    //   }
    // }

    return {
      messages: [...historyMessages, ...state.messages, response],
    };
  } catch (error) {
    console.error('Error in chatNode:', error);
    return {
      messages: state.messages,
    };
  }
};
