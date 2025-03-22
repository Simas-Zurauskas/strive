import { CPointer } from '@/types';
import { BaseMessage } from '@langchain/core/messages';
import { BaseMessageLike } from '@langchain/core/messages';
import { Annotation, messagesStateReducer } from '@langchain/langgraph';

export const StateAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[], BaseMessageLike[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  cPointer: Annotation<CPointer>(),
});

export type State = typeof StateAnnotation.State;
