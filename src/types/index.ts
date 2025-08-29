export interface User {
  id: string;
  email: string;
  role: 'teacher' | 'student' | 'admin';
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  terms: number;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  courseId: string;
  term: number;
}

export interface Tutor {
  id: string;
  name: string;
  assignedSubjects: string[]; // array of subject IDs
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  course: string;
  term: number;
  subject: string;
  lessons: Lesson[];
  progress: number;
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // This could be a structured object or markdown
}

export interface ToolbarState {
  penActive: boolean;
  whiteboardVisible: boolean;
  selectedTool: 'pen' | 'eraser' | 'select' | null;
}
