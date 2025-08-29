import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Course, Subject } from '../../types';
import * as api from '../../lib/api';

interface CreateUnitModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateUnitModal: React.FC<CreateUnitModalProps> = ({ onClose, onCreate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [term, setTerm] = useState(1);
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedCourses, fetchedSubjects] = await Promise.all([
          api.getCourses(),
          api.getSubjects(),
        ]);
        setCourses(fetchedCourses);
        setSubjects(fetchedSubjects);
        if (fetchedCourses.length > 0) {
          setCourseId(fetchedCourses[0].id);
        }
      } catch (error) {
        toast.error("Failed to load course data.");
      }
    };
    fetchData();
  }, []);

  const selectedCourse = useMemo(() => courses.find(c => c.id === courseId), [courseId, courses]);
  const availableTerms = useMemo(() => selectedCourse ? Array.from({ length: selectedCourse.terms }, (_, i) => i + 1) : [], [selectedCourse]);
  const availableSubjects = useMemo(() => {
    return subjects.filter(s => s.course_id === courseId && s.term === term);
  }, [courseId, term, subjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !subjectId) {
      toast.error('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await api.createUnit({
        title,
        description,
        course_id: courseId,
        term,
        subject_id: subjectId,
        lessons: [],
        progress: 0,
        status: 'draft',
      });
      onCreate();
      onClose();
    } catch (error) {
      toast.error('Failed to create unit.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Unit</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                  <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{selectedCourse?.name.includes('GNM') ? 'Year' : 'Semester'}</label>
                  <select value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500">
                    {availableTerms.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                  <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500" required>
                    <option value="" disabled>Select Subject</option>
                    {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
              <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Unit'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateUnitModal;
