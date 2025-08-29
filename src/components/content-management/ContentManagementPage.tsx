import React, { useState } from 'react';
import { Book, FlaskConical, User, GraduationCap } from 'lucide-react';
import CourseEditor from './CourseEditor';
import SubjectEditor from './SubjectEditor';
import TutorEditor from './TutorEditor';
import LessonEditor from './LessonEditor';

type ContentTab = 'courses' | 'subjects' | 'tutors' | 'lessons';

const ContentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>('courses');

  const tabs = [
    { id: 'courses', label: 'Courses', icon: Book },
    { id: 'subjects', label: 'Subjects', icon: FlaskConical },
    { id: 'lessons', label: 'Lessons', icon: GraduationCap },
    { id: 'tutors', label: 'Tutors', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CourseEditor />;
      case 'subjects':
        return <SubjectEditor />;
      case 'lessons':
        return <LessonEditor />;
      case 'tutors':
        return <TutorEditor />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Build and manage the curriculum structure</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <div className="md:w-1/4">
          <div className="space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:w-3/4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage;
