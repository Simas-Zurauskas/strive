import { RunnableConfig } from '@langchain/core/runnables';
import { StateAnnotation, State } from './state';

export type NodeFunction = (state: State, _config: RunnableConfig) => Promise<typeof StateAnnotation.Update>;
