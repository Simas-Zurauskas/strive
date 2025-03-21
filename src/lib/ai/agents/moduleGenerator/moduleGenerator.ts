import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { InputStateAnnotation, OutputStateAnnotation } from './state';
import { genModuleNode } from './nodes';

const moduleGenerator = () => {
  const workflow = new StateGraph({ input: InputStateAnnotation, output: OutputStateAnnotation })
    .addNode('genModule', genModuleNode)
    .addEdge(START, 'genModule')
    .addEdge('genModule', END);

  const graph = workflow.compile();

  return graph;
};

export default moduleGenerator;
