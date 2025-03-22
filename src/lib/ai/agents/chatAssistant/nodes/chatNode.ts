import { NodeFunction } from '../types';
import { model } from '@/lib/ai/models';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import CourseModel, { ChatMessage } from '@/lib/mongo/models/CourseModel';

type PlainChatMessage = Omit<ChatMessage, '_id'>;

const convertToSerializedMessage = (messages: BaseMessage): PlainChatMessage => {
  return {
    content: messages.content.toString(),
    role: messages instanceof HumanMessage ? 'user' : 'assistant',
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

    let history: PlainChatMessage[] = [];

    if (!state.cPointer.module) {
      history = course.chat;
    }

    if (state.cPointer.module?.moduleId) {
      const moduleObj = state.cPointer.module;

      if (moduleObj.lessonId) {
        const lesson = course.modules.roadmap
          .find((el) => el.id === moduleObj.moduleId)
          // @ts-ignore
          ?.lessons.find((el) => el.id === moduleObj.lessonId);
        history = lesson?.chat || [];
      } else {
        const module = course.modules.roadmap.find((el) => el.id === moduleObj.moduleId);
        history = module?.chat || [];
      }
    }

    //  history =
    //   course?.chat.map((el) => ({
    //     content: el.content,
    //     role: el.role,
    //   })) || [];

    const response = await promptTemplate.pipe(model).invoke({
      messages: [...history, ...state.messages.map(convertToSerializedMessage)] satisfies PlainChatMessage[],
      learningGoal: course.initial.learningGoal,
    });

    const chatMessages = [...state.messages, response].map(convertToSerializedMessage);

    await course.updateOne({ $push: { chat: chatMessages } });

    return {
      messages: [...state.messages, response],
    };
  } catch (error) {
    console.error('Error in chatNode:', error);
    return {
      messages: state.messages,
    };
  }
};
