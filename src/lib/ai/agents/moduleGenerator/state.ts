import { Annotation } from '@langchain/langgraph';

export const InputStateAnnotation = Annotation.Root({
  uxId: Annotation<string>(),
  moduleId: Annotation<string>(),
});

export const OutputStateAnnotation = Annotation.Root({
  lessons: Annotation<
    { order: number; title: string; description: string; durationMinutes: number; contentOutlineSpec: string }[]
  >({
    default: () => [],
    reducer: (current, incoming) => incoming,
  }),
});

export type InputState = typeof InputStateAnnotation.State;
export type OutputState = typeof OutputStateAnnotation.State;
