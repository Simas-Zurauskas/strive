import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const searchTavily = new TavilySearchResults({
  maxResults: 3,
});

const retrievalTool = tool(
  async ({ query }) => {
    console.log('===retrievalTool===', query);

    const makeRequest = async (query: string) => {
      try {
        // This will be replaced with actual vector DB query implementation
        // The query will search through:
        // 1. User-provided learning materials (parsed files and crawled web content)
        // 2. AI-generated course content
        // 3. Course module content
        return JSON.stringify([]);
      } catch (error) {
        console.log(error);
      }
    };

    const data = await makeRequest(query);
    return JSON.stringify({ query, data });
  },
  {
    name: 'retrieval',
    description: `Retrieve relevant learning content from the vector database to support course generation and chatbot responses. 
    This tool searches through:
    1. User-provided learning materials (parsed files and crawled web content)
    2. AI-generated course content
    3. Course module content
    
    The tool helps in:
    - Estimating available content hours from user materials
    - Supporting AI in generating course content
    - Providing context for chatbot responses about course content
    - Filling gaps in course modules with relevant information`,
    schema: z.object({
      query: z
        .string()
        .min(1, 'Query cannot be empty')
        .describe(
          'The search term used to look for specific learning content in the vector database. This can be a topic, concept, or specific course module content.',
        ),
    }),
  },
);

export const TOOLS = [searchTavily, retrievalTool];
