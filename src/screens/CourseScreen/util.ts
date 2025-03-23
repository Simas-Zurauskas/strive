import { QKeys } from '@/types';

import { CPointer } from '@/types';

export const getChatKey = (cPointer: CPointer) => {
  return [QKeys.CHAT, cPointer.uxId, cPointer.module?.moduleId, cPointer.module?.lessonId];
};
