import { NodeFunction } from '../../types';
import { model } from '@/lib/ai/models';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import CourseModel, { ChatMessage } from '@/lib/mongo/models/CourseModel';
import { getDbHistory, saveChatHistory } from './util';
import { takeRight } from 'lodash';

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

    const historyMessages = takeRight(dbHistory.map(convertToLangChainMessage), 10);
    const allMessages = [...historyMessages, ...state.messages];

    console.log('ALL MESSAGES', allMessages);

    const response = await promptTemplate.pipe(model).invoke({
      messages: allMessages,
      learningGoal: course.initial.learningGoal,
    });

    const newMessages = [...state.messages, response].map(convertToSerializedMessage);

    console.log('NEW MESSAGES', newMessages);

    await saveChatHistory({ cPointer: state.cPointer, course, newMessages });

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
