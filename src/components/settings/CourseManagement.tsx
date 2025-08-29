import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Plus, Trash2 } from 'lucide-react';
import { getInitialCourses } from '../../data/seedData';
import { Course } from '../../types';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(getInitialCourses());
  const [courseName, setCourseName] = useState('');
  const [numTerms, setNumTerms] = useState(2);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName) return;
    const newCourse: Course = {
      id: new Date().toISOString(),
      name: courseName,
      terms: numTerms,
    };
    setCourses([...courses, newCourse]);
    setCourseName('');
    setNumTerms(2);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Courses</h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course Name</label>
            <input type="text" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g., Science Grade 6" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Terms</label>
            <input type="number" min="1" max="4" value={numTerms} onChange={e => setNumTerms(Number(e.target.value))} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <motion.button type="submit" whileTap={{ scale: 0.98 }} className="md:col-span-3 w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-5 h-5" /> Add Course
          </motion.button>
        </form>
      </div>
      
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
            <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
