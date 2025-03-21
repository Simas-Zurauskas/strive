import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { Serper } from '@langchain/community/tools/serper';
import axios from 'axios';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const searchTavily = new TavilySearchResults({
  maxResults: 3,
});

const searchSerper = new Serper();

const searchWebTool = tool(
  async ({ query }) => {
    console.log('===searchWebTool===', query);

    const makeRequest = async (query: string) => {
      try {
        const response = await axios.request({
          method: 'POST',
          maxBodyLength: Infinity,
          url: 'https://google.serper.dev/images',
          headers: {
            'X-API-KEY': process.env.SERPER_API_KEY,
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            q: query,
            location: 'United Kingdom',
            gl: 'gb',
          }),
        });
        return JSON.stringify(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const data = await makeRequest(query);
    return JSON.stringify({ query, data });
  },
  {
    name: 'search_web',
    description: 'Search the web for information.',
    schema: z.object({
      query: z
        .string()
        .min(1, 'Query cannot be empty')
        .describe('The search term used to look for specific information on the web.'),
    }),
  },
);

export const TOOLS = [searchWebTool];
// export const TOOLS = [];
