import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { Unit, Lesson } from '../../types';
import * as api from '../../lib/api';

interface EditUnitModalProps {
  unit: Unit;
  onClose: () => void;
  onSave: () => void;
}

const EditUnitModal: React.FC<EditUnitModalProps> = ({ unit, onClose, onSave }) => {
  const [title, setTitle] = useState(unit.title);
  const [description, setDescription] = useState(unit.description);
  const [lessons, setLessons] = useState<Lesson[]>(unit.lessons);
  const [loading, setLoading] = useState(false);

  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonContent, setNewLessonContent] = useState('');

  const handleAddLesson = () => {
    if (!newLessonTitle.trim()) return;
    const newLesson: Lesson = {
      id: uuidv4(),
      title: newLessonTitle,
      content: `<ul><li>${newLessonContent.split('\n').join('</li><li>')}</li></ul>`,
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle('');
    setNewLessonContent('');
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessons(lessons.filter(l => l.id !== lessonId));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update unit basic info
      await api.updateUnit(unit.id, {
        title,
        description,
      });
      
      // Note: Lesson updates would need separate API calls
      // This is simplified for now
      onSave();
    } catch (error) {
      toast.error("Failed to update unit.");
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
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Unit</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unit Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"></textarea>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Topics</h4>
              <div className="space-y-2">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{lesson.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{lesson.content.replace(/<[^>]+>/g, ' ') || 'No content'}</p>
                    </div>
                    <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {lessons.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No topics added yet.</p>}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Add New Topic</h5>
              <input 
                type="text" 
                placeholder="Topic Title" 
                value={newLessonTitle}
                onChange={e => setNewLessonTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
              <textarea 
                placeholder="Topic Content (one point per line)" 
                rows={3}
                value={newLessonContent}
                onChange={e => setNewLessonContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
              <button type="button" onClick={handleAddLesson} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg border border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50">
                <Plus className="w-4 h-4" /> Add Topic
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button type="button" onClick={handleSave} disabled={loading} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditUnitModal;
