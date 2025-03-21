import { END, START } from '@langchain/langgraph';
import { StateGraph } from '@langchain/langgraph';
import { StateAnnotation, State } from './state';
import { genLessonNode, genHeroImage, saveToDbNode, criticNode } from './nodes';

const routeAfterCritic = (state: State): string => {
  return state.criticEvaluation.needsRevision === true ? 'genLesson' : 'saveToDb';
};

const lessonGenerator = () => {
  const workflow = new StateGraph(StateAnnotation)
    .addNode('genLesson', genLessonNode)
    .addNode('genHeroImage', genHeroImage)
    .addNode('critic', criticNode)
    .addNode('saveToDb', saveToDbNode)
    .addEdge(START, 'genLesson')
    .addEdge(START, 'genHeroImage')
    .addEdge('genLesson', 'critic')
    .addEdge('genHeroImage', 'critic')
    .addConditionalEdges('critic', routeAfterCritic, {
      saveToDb: 'saveToDb',
      genLesson: 'genLesson',
    })
    .addEdge('saveToDb', END);

  const graph = workflow.compile();

  return graph;
};

export default lessonGenerator;
