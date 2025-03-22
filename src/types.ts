declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

declare module 'next-auth' {
  interface Session {
    user: AuthUser;
  }
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export enum QKeys {
  COURSES = 'courses',
  COURSE = 'course',
  LESSON_CONTENT = 'lessonContent',
  CHAT = 'chat',
}

export interface SimpleEdge {
  id: string;
  source: string;
  target: string;
}

export interface CPointer {
  uxId: string;
  module?: {
    moduleId: string;
    lessonId?: string;
  };
}
