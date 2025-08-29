import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasDraw from 'react-canvas-draw';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Menu,
  Loader,
  BookOpen,
  FileText
} from 'lucide-react';
import { Unit, Lesson } from '../../types';
import * as api from '../../lib/api';
import TutorPadToolbar from './TutorPadToolbar';

const TutorPadPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [penActive, setPenActive] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const canvasRef = useRef<CanvasDraw>(null);

  useEffect(() => {
    if (!unitId) {
      setLoading(false);
      return;
    }
    const fetchUnit = async () => {
      setLoading(true);
      try {
        const fetchedUnit = await api.getUnitById(unitId);
        setUnit(fetchedUnit);
        setCurrentLessonIndex(0);
      } catch (error) {
        console.error('Error fetching unit:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUnit();
  }, [unitId]);

  const currentLesson: Lesson | null = unit?.lessons[currentLessonIndex] || null;

  const handleClearDrawing = () => {
    canvasRef.current?.clear();
  };

  const handleTogglePen = () => {
    setPenActive(!penActive);
  };

  const handleFontSizeChange = (increase: boolean) => {
    setFontSize(prev => increase ? Math.min(prev + 2, 24) : Math.max(prev - 2, 12));
  };

  const navigateLesson = (direction: 'prev' | 'next') => {
    if (!unit) return;
    if (direction === 'prev' && currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    } else if (direction === 'next' && currentLessonIndex < unit.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader className="w-8 h-8 animate-spin text-primary-600 mb-4" />
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading TutorPad...</p>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Unit not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Chapter and Topics Navigation */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">TutorPad</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">{unit.course}</span>
                <span>•</span>
                <span>Term {unit.term}</span>
              </div>
            </div>

            {/* Chapter Info */}
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                Chapter: {unit.title}
              </h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                {unit.description || 'No description available'}
              </p>
            </div>

            {/* Topics List */}
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                Topics ({unit.lessons.length})
              </h4>
              <div className="space-y-1">
                {unit.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full flex items-start gap-3 p-3 text-left rounded-lg transition-all ${
                      currentLessonIndex === index
                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mt-0.5 ${
                      currentLessonIndex === index 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{lesson.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Topic</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => navigateLesson('prev')}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {currentLessonIndex + 1} / {unit.lessons.length}
                </span>
                <button
                  onClick={() => navigateLesson('next')}
                  disabled={currentLessonIndex >= unit.lessons.length - 1}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Exit TutorPad
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            {!showSidebar && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentLesson?.title || 'Select a Topic'}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unit.subject} • Topic {currentLessonIndex + 1} of {unit.lessons.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              penActive 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {penActive ? 'Drawing Mode' : 'View Mode'}
            </span>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full overflow-y-auto p-6 md:p-8">
            <motion.div
              key={currentLesson?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {currentLesson ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                  <div className="prose dark:prose-invert max-w-none">
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      style={{ fontSize: `${fontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    No Topic Selected
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select a topic from the sidebar to view its content
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Drawing Canvas Overlay */}
          <AnimatePresence>
            {penActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-auto"
                style={{ top: 0, left: 0, right: 0, bottom: 0 }}
              >
                <CanvasDraw
                  ref={canvasRef}
                  brushColor="#ef4444"
                  brushRadius={3}
                  lazyRadius={0}
                  canvasWidth={window.innerWidth}
                  canvasHeight={window.innerHeight}
                  hideGrid={true}
                  className="w-full h-full"
                  style={{ background: 'transparent' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Toolbar */}
      <TutorPadToolbar
        penActive={penActive}
        onTogglePen={handleTogglePen}
        onClearDrawing={handleClearDrawing}
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
      />
    </div>
  );
};

export default TutorPadPage;