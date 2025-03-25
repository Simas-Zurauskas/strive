import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { initVectorStore } from '../../stores';

const searchTavily = new TavilySearchResults({
  maxResults: 7,
});

const retrievalTool = tool(
  async ({ query }) => {
    console.log('===retrievalTool===', query);
    const vectorStore = await initVectorStore();

    const docs = await vectorStore.similaritySearch(query, 7);

    const data = docs.map((doc) => doc.pageContent);

    return JSON.stringify(data);
  },
  {
    name: 'retrieval',
    description: `Retrieve relevant learning content from the vector database to support mentor.`,
    schema: z.object({
      query: z
        .string()
        .min(1, 'Query cannot be empty')
        .describe('The search term query used to look for specific learning content in the vector database.'),
    }),
  },
);

export const TOOLS = [searchTavily, retrievalTool];
