export type View =
  | { type: 'root' }
  | { type: 'module'; moduleId: string }
  | { type: 'lesson'; moduleId: string; lessonNumber: number; lessonId: string };
