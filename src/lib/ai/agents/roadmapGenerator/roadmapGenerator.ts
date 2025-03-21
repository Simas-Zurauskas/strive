import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { State } from './state';
import { genRoadmapNode, senseCheckNode } from './nodes';

const routeAfterValidation = (state: typeof State.State) => {
  if (state.validInput) {
    return 'genRoadmap';
  } else {
    return END;
  }
};

const roadmapGenerator = () => {
  const workflow = new StateGraph(State)
    .addNode('validateInput', senseCheckNode)
    .addNode('genRoadmap', genRoadmapNode)
    .addEdge(START, 'validateInput')
    .addConditionalEdges('validateInput', routeAfterValidation)
    .addEdge('genRoadmap', END);

  const graph = workflow.compile();

  return graph;
};

export default roadmapGenerator;
