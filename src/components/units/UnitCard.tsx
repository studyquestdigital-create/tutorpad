import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Edit, Trash2, BookOpen } from 'lucide-react';
import { Unit } from '../../types';

interface UnitCardProps {
  unit: Unit;
  index: number;
  onEdit: (unit: Unit) => void;
  onDelete: (unitId: string) => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, index, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleStartLesson = () => {
    navigate(`/classroom/${unit.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-md font-semibold text-gray-900 dark:text-white line-clamp-2">
            {unit.title}
          </h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(unit.status)}`}>
            {unit.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {unit.description || 'No description provided.'}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            {unit.lessons.length} topics
          </span>
        </div>

        <div className="w-full mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{unit.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <motion.div
              className="bg-primary-600 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${unit.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-auto">
          <motion.button
            onClick={handleStartLesson}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm min-h-[44px]"
          >
            <Play className="w-4 h-4" />
            Start Lesson
          </motion.button>
          
          <motion.button
            onClick={() => onEdit(unit)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[44px] min-h-[44px]"
            title="Edit Unit Topics"
          >
            <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </motion.button>
          
          <motion.button
            onClick={() => onDelete(unit.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 hover:border-red-300 transition-colors min-w-[44px] min-h-[44px]"
            title="Delete Unit"
          >
            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-600" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UnitCard;
