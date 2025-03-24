import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { State, StateAnnotation } from './state';
import { chatNode } from './nodes';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { AIMessage, ToolMessage } from '@langchain/core/messages';
import { TOOLS } from './tools';
import { convertToSerializedMessage, saveChatHistory } from './nodes/chatNode/util';
import { PlainChatMessage } from './nodes/chatNode/types';
import _ from 'lodash';
import CourseModel from '@/lib/mongo/models/CourseModel';

const routeModelOutput = async (state: State): Promise<string> => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return 'tools';
  } else {
    const msg = state.messages.map(convertToSerializedMessage);
    const newMessages = [_.first(msg), _.last(msg)].filter(Boolean) as PlainChatMessage[];

    const course = await CourseModel.findOne({ uxId: state.cPointer.uxId });

    if (course) {
      await saveChatHistory({ cPointer: state.cPointer, course, newMessages });
    }

    return END;
  }
};

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
