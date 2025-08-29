import { supabase } from './supabaseClient';
import { Course, Subject, Unit, Tutor, Lesson } from '../types';

// --- Courses API ---
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase.from('courses').select('*').order('name');
  if (error) throw new Error(error.message);
  return data || [];
};

export const createCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  const { data, error } = await supabase.from('courses').insert(course).select().single();
  if (error) throw new Error(error.message);
  return data;
};

// --- Subjects API ---
export const getSubjects = async (): Promise<any[]> => {
  const { data, error } = await supabase.from('subjects').select('*, courses(name)').order('name');
  if (error) throw new Error(error.message);
  
  // Map to frontend type
  return data.map(s => ({
    ...s,
    courseName: s.courses.name,
  }));
};

export const createSubject = async (subject: Omit<Subject, 'id' | 'courseId'> & { course_id: string }): Promise<any> => {
  const { data, error } = await supabase.from('subjects').insert(subject).select('*, courses(name)').single();
  if (error) throw new Error(error.message);
  return { ...data, courseName: data.courses.name };
};

// --- Tutors API ---
export const getTutors = async (): Promise<Tutor[]> => {
  // This is a simplified fetch. A real implementation might use RPC or more complex joins.
  const { data, error } = await supabase.from('tutors').select('*');
  if (error) throw new Error(error.message);
  // For now, assignedSubjects will be empty as we are not querying the join table yet.
  return data.map(t => ({ ...t, assignedSubjects: [] })) || [];
};

// --- Units API ---
export const getUnits = async (): Promise<Unit[]> => {
  const { data, error } = await supabase
    .from('units')
    .select('*, courses(name), subjects(name), lessons(*)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((unit: any) => ({
    id: unit.id,
    title: unit.title,
    description: unit.description,
    course: unit.courses?.name ?? 'Unknown Course',
    term: 1, // Default term since it's not in the current schema
    subject: unit.subjects?.name ?? 'Unknown Subject',
    lessons: unit.lessons?.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content || '',
    })) || [],
    progress: unit.progress,
    status: unit.status,
    lastModified: new Date(unit.created_at).toLocaleDateString('en-CA'),
  }));
};

export const getUnitById = async (id: string): Promise<Unit | null> => {
  const { data, error } = await supabase
    .from('units')
    .select('*, courses(name), subjects(name), lessons(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching unit:', error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    course: data.courses?.name ?? 'Unknown Course',
    term: 1, // Default term since it's not in the current schema
    subject: data.subjects?.name ?? 'Unknown Subject',
    lessons: data.lessons?.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content || '',
    })) || [],
    progress: data.progress,
    status: data.status,
    lastModified: new Date(data.created_at).toLocaleDateString('en-CA'),
  };
};

export const createUnit = async (unitData: Omit<Unit, 'id' | 'lastModified' | 'course' | 'subject'> & { course_id: string, subject_id: string }): Promise<any> => {
  const { data, error } = await supabase.from('units').insert(unitData).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateUnit = async (unitId: string, updates: { title: string, description: string }): Promise<any> => {
  const { data, error } = await supabase.from('units').update(updates).eq('id', unitId).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteUnit = async (unitId: string): Promise<void> => {
  const { error } = await supabase.from('units').delete().eq('id', unitId);
  if (error) throw new Error(error.message);
};
