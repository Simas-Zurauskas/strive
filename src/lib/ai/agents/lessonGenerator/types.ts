import { RunnableConfig } from '@langchain/core/runnables';
import { State, StateAnnotation } from './state';

export type NodeFunctionOutput = (state: State, config: RunnableConfig) => Promise<typeof StateAnnotation.Update>;
