import React from 'react';
import { motion } from 'framer-motion';
import { 
  Pen, 
  Eraser, 
  Trash2, 
  Palette, 
  Square,
  Circle,
  Undo,
  Redo,
  Save
} from 'lucide-react';
import { ToolbarState } from '../../types';

interface ToolbarProps {
  toolbarState: ToolbarState;
  onToolChange: (tool: 'pen' | 'eraser' | 'select' | null) => void;
  onPenToggle: () => void;
  onWhiteboardToggle: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  toolbarState,
  onToolChange,
  onPenToggle,
  onWhiteboardToggle,
  onClear,
  onUndo,
  onRedo,
  onSave,
}) => {
  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen Tool' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'select', icon: Square, label: 'Select' },
  ];

  return (
    <motion.div 
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50"
    >
      <div className="flex flex-col gap-3">
        {/* Pen Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onPenToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors min-w-[44px] min-h-[44px] ${
            toolbarState.penActive
              ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle Pen Mode"
        >
          <Pen className="w-5 h-5" />
        </motion.button>

        {/* Tool Selection */}
        {toolbarState.penActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-2"
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = toolbarState.selectedTool === tool.id;
              
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToolChange(tool.id as 'pen' | 'eraser' | 'select')}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors min-w-[44px] min-h-[44px] ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  title={tool.label}
                >
                  <Icon className="w-4 h-4" />
                </motion.button>
              );
            })}

            {/* Color Palette */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px]"
              title="Color Palette"
            >
              <Palette className="w-4 h-4" />
            </motion.button>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onUndo}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors mb-2 min-w-[44px] min-h-[44px]"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRedo}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors mb-2 min-w-[44px] min-h-[44px]"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClear}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors mb-2 min-w-[44px] min-h-[44px]"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSave}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors min-w-[44px] min-h-[44px]"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Toolbar;
