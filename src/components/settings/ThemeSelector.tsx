import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const themes = [
  { name: 'purple', color: '#9333ea' },
  { name: 'blue', color: '#2563eb' },
  { name: 'green', color: '#16a34a' },
];

const ThemeSelector: React.FC = () => {
  const { primaryColor, setPrimaryColor } = useTheme();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Primary Color Theme</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Choose a primary color for the application interface.</p>
      
      <div className="grid grid-cols-3 gap-4">
        {themes.map(theme => (
          <motion.div key={theme.name} whileTap={{ scale: 0.98 }}>
            <button
              onClick={() => setPrimaryColor(theme.name as 'purple' | 'blue' | 'green')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                primaryColor === theme.name ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: theme.color }}></div>
                  <span className="font-medium capitalize text-gray-800 dark:text-gray-200">{theme.name}</span>
                </div>
                {primaryColor === theme.name && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check className="w-5 h-5 text-primary-600" />
                  </motion.div>
                )}
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
