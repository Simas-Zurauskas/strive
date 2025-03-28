import { OpenAIEmbeddings } from '@langchain/openai';

export const embeddings = new OpenAIEmbeddings({
  model: 'text-embedding-3-small',
  openAIApiKey: process.env.OPENAI_API_KEY,
});
