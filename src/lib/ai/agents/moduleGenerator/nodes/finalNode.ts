import { InputState } from '../state';
import { NodeFunctionOutput } from '../types';

export const finalNode: NodeFunctionOutput = async (state: InputState) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      lessons: [],
    };
  } catch (error) {
    console.error('Error in sense check node:', error);
    return {
      text: 'error',
    };
  }
};
