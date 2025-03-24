'use server';
import { PineconeStore } from '@langchain/pinecone';
import { embeddings } from './embeddings';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const pineconeIndex = pc.index(process.env.PINECONE_INDEX_NAME!);

export const initVectorStore = async () => {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  return vectorStore;
};
