import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, Trash2 } from 'lucide-react';
import { getInitialSubjects, getInitialCourses } from '../../data/seedData';
import { Subject } from '../../types';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(getInitialSubjects());
  const courses = getInitialCourses();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Subjects</h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Course</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Term</label>
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                <option>1</option>
                <option>2</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject Name</label>
            <input type="text" placeholder="e.g., Biology" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
            <textarea rows={2} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"></textarea>
          </div>
          <motion.button type="submit" whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-5 h-5" /> Add Subject
          </motion.button>
        </form>
      </div>
      
      <div className="space-y-3">
        {subjects.map(subject => (
          <div key={subject.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-primary-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{subject.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{courses.find(c => c.id === subject.courseId)?.name} - Term {subject.term}</p>
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

export default SubjectManagement;
