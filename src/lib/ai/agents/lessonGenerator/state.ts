import { Annotation } from '@langchain/langgraph';

export const StateAnnotation = Annotation.Root({
  uxId: Annotation<string>(),
  moduleId: Annotation<string>(),
  lessonId: Annotation<string>(),
  lessonContent: Annotation<string>(),
  lessonSummary: Annotation<string>(),
  heroImageUrl: Annotation<string>(),
  criticEvaluation: Annotation<{
    totalRevisions: number;
    needsRevision: boolean;
    feedbackStudent: string;
    feedbackExpert: string;
  }>(),
});

export type State = typeof StateAnnotation.State;
