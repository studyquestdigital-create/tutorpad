import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Plus, Trash2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { Course } from '../../types';
import * as api from '../../lib/api';

const CourseEditor: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [numTerms, setNumTerms] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await api.getCourses();
        setCourses(data);
      } catch (error) {
        toast.error('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName) return;
    setIsSubmitting(true);
    try {
      const newCourse = await api.createCourse({ name: courseName, terms: numTerms });
      setCourses([...courses, newCourse]);
      setCourseName('');
      setNumTerms(2);
      toast.success('Course added!');
    } catch (error) {
      toast.error('Failed to add course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Courses</h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
            <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g., B.Sc Computer Science" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Terms</label>
            <input type="number" min="1" max="12" value={numTerms} onChange={e => setNumTerms(Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }} className="md:col-span-3 w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {isSubmitting ? 'Adding...' : 'Add Course'}
          </motion.button>
        </form>
      </div>
      
      {loading ? (
        <div className="flex justify-center"><Loader className="w-6 h-6 animate-spin text-primary-500" /></div>
      ) : (
        <div className="space-y-3">
          {courses.map(course => (
            <div key={course.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Book className="w-5 h-5 text-primary-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{course.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.terms} Term{course.terms > 1 ? 's' : ''}</p>
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

export default CourseEditor;
