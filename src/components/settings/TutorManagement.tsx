import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Trash2 } from 'lucide-react';
import { getInitialTutors, getInitialSubjects } from '../../data/seedData';
import { Tutor } from '../../types';

const TutorManagement: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>(getInitialTutors());
  const subjects = getInitialSubjects();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Manage Tutors</h3>
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tutor Name</label>
            <input type="text" placeholder="e.g., Dr. Evelyn Reed" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Subjects</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Hold Ctrl/Cmd to select multiple</p>
            <select multiple className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 h-32">
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <motion.button type="submit" whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            <Plus className="w-5 h-5" /> Add Tutor
          </motion.button>
        </form>
      </div>
      
      <div className="space-y-3">
        {tutors.map(tutor => (
          <div key={tutor.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{tutor.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tutor.assignedSubjects.length} subject{tutor.assignedSubjects.length !== 1 ? 's' : ''} assigned
                </p>
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

export default TutorManagement;
