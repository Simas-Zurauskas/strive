import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { State, StateAnnotation } from './state';
import { chatNode } from './nodes';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage } from '@langchain/core/messages';

const chatAssistant = () => {
  const workflow = new StateGraph(StateAnnotation)
    .addNode('chatNode', chatNode)
    // .addNode('tools', new ToolNode([]))
    .addEdge(START, 'chatNode')
    // .addEdge('chatNode', 'tools')
    .addEdge('chatNode', END);

  const graph = workflow.compile();

  return graph;
};

export default chatAssistant;
