import { RunnableConfig } from '@langchain/core/runnables';
import { InputState, InputStateAnnotation, OutputStateAnnotation } from './state';

export type NodeFunctionOutput = (
  state: InputState,
  _config: RunnableConfig,
) => Promise<typeof OutputStateAnnotation.Update>;
