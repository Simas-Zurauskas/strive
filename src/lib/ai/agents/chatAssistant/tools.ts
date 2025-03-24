import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

const searchTavily = new TavilySearchResults({
  maxResults: 3,
});

export const TOOLS = [searchTavily];
