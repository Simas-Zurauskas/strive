import { Annotation } from '@langchain/langgraph';

export const State = Annotation.Root({
  learningGoal: Annotation<string>(),
  currentKnowledge: Annotation<string>(),
  overrideInstructions: Annotation<string>(),
  result: Annotation<any>(),
  validInput: Annotation<boolean>(),
  validationMessage: Annotation<string>(),
});
