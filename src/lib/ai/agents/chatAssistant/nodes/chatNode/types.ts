import { ChatMessage } from '@/lib/mongo/models/CourseModel';

export type PlainChatMessage = Omit<ChatMessage, '_id'>;
