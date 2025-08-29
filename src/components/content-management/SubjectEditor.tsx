import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Subject, Course } from '../../types';
import * as api from '../../lib/api';

const SubjectEditor: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [courseId, setCourseId] = useState('');
  const [term, setTerm] = useState(1);
  const [subjectName, setSubjectName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subjectsData, coursesData] = await Promise.all([api.getSubjects(), api.getCourses()]);
        setSubjects(subjectsData);
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setCourseId(coursesData[0].id);
        }
      } catch (error) {
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedCourse = useMemo(() => courses.find(c => c.id === courseId), [courseId, courses]);
  const availableTerms = useMemo(() => selectedCourse ? Array.from({ length: selectedCourse.terms }, (_, i) => i + 1) : [], [selectedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || !courseId) return;
    setIsSubmitting(true);
    try {
      const newSubject = await api.createSubject({ name: subjectName, description, course_id: courseId, term });
      setSubjects([...subjects, newSubject]);
      setSubjectName('');
      setDescription('');
      toast.success('Subject added!');
    } catch (error) {
      toast.error('Failed to add subject.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Subjects</h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course</label>
              <select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Term</label>
              <select value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {availableTerms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
            <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder="e.g., Biology" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
          </div>
          <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {isSubmitting ? 'Adding...' : 'Add Subject'}
          </motion.button>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center"><Loader className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : (
        <div className="space-y-3">
          {subjects.map(subject => (
            <div key={subject.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <FlaskConical className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{subject.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{subject.courseName} - Term {subject.term}</p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full" disabled>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectEditor;
