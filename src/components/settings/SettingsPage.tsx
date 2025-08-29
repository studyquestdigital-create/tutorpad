import React from 'react';
import { Palette, UserCircle } from 'lucide-react';
import ThemeSelector from './ThemeSelector';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your application and profile settings</p>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h3>
          </div>
          <ThemeSelector />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Profile management options coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
