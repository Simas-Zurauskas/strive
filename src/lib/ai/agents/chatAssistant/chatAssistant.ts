import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { State, StateAnnotation } from './state';
import { chatNode } from './nodes';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage } from '@langchain/core/messages';
import { TOOLS } from './tools';

function routeModelOutput(state: State): string {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return 'tools';
  } else {
    return END;
  }
}

const chatAssistant = () => {
  const workflow = new StateGraph(StateAnnotation)
    .addNode('chatNode', chatNode)
    .addNode('tools', new ToolNode(TOOLS))
    .addEdge(START, 'chatNode')
    .addConditionalEdges('chatNode', routeModelOutput)
    .addEdge('tools', 'chatNode');

  const graph = workflow.compile();

  return graph;
};

export default chatAssistant;
