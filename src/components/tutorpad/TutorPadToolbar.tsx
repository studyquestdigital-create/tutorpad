import React from 'react';
import { motion } from 'framer-motion';
import { Pen, Trash2 } from 'lucide-react';

interface TutorPadToolbarProps {
  penActive: boolean;
  onTogglePen: () => void;
  onClearDrawing: () => void;
}

const TutorPadToolbar: React.FC<TutorPadToolbarProps> = ({
  penActive,
  onTogglePen,
  onClearDrawing,
}) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex flex-col gap-3">
          {/* Pen Tool */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onTogglePen}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all min-w-[48px] min-h-[48px] ${
              penActive
                ? 'bg-red-100 text-red-600 border-2 border-red-300 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-2 border-transparent'
            }`}
            title={penActive ? 'Disable Drawing' : 'Enable Drawing'}
          >
            <Pen className="w-5 h-5" />
          </motion.button>

          {/* Clear Drawing */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClearDrawing}
            disabled={!penActive}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all min-w-[48px] min-h-[48px] ${
              penActive
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 border-2 border-transparent hover:border-red-200 dark:hover:border-red-800'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border-2 border-transparent'
            }`}
            title="Clear Drawing"
          >
            <Trash2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Drawing Status Indicator */}
        {penActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Drawing
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TutorPadToolbar;