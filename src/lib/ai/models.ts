import { ChatOpenAI } from '@langchain/openai';

export const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  openAIApiKey: process.env.OPENAI_API_KEY!,
  temperature: 0,
});
