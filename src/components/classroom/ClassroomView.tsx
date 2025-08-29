import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasDraw from 'react-canvas-draw';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Moon,
  Sun,
  Pen,
  Trash2,
  Menu,
  Minimize2,
  Loader
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Lesson, Unit } from '../../types';
import * as api from '../../lib/api';

const ClassroomView: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [penActive, setPenActive] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showCurriculum, setShowCurriculum] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<CanvasDraw>(null);

  useEffect(() => {
    if (!unitId) {
      setLoading(false);
      return;
    }
    const fetchUnit = async () => {
      setLoading(true);
      const fetchedUnit = await api.getUnitById(unitId);
      setUnit(fetchedUnit);
      setCurrentLessonIndex(0);
      setLoading(false);
    };
    fetchUnit();
  }, [unitId]);

  const onExitClassroom = () => {
    navigate('/');
  };

  const currentLesson: Lesson | null = unit?.lessons[currentLessonIndex] || null;

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const adjustFontSize = (increase: boolean) => {
    setFontSize(prev => increase ? Math.min(prev + 2, 32) : Math.max(prev - 2, 12));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error(err));
    }
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
        <p className="text-lg text-gray-600 dark:text-gray-400">Loading classroom...</p>
      </div>
    )
  }

  if (!unit) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Lesson unit not found.</p>
        <button
          onClick={onExitClassroom}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''} bg-gray-50 dark:bg-gray-900`}>
      {/* Left Sidebar - Curriculum Navigation */}
      <AnimatePresence>
        {showCurriculum && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-sm"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{unit.title}</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCurriculum(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {unit.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLessonIndex(index)}
                  className={`w-full flex items-center gap-3 p-2 text-left rounded-lg transition-colors ${
                    currentLessonIndex === index
                      ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className={`text-xs font-medium w-6 shrink-0 ${
                    currentLessonIndex === index ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm">{lesson.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 flex items-center justify-between shadow-md z-20 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {!showCurriculum && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowCurriculum(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            )}
            <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setPenActive(!penActive)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${ penActive ? 'bg-red-100 text-red-600 border border-red-300 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                  title="Pen Tool"
                >
                  <Pen className="w-5 h-5" />
                </motion.button>
                <motion.button onClick={handleClear} disabled={!penActive} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50" title="Clear Drawing">
                  <Trash2 className="w-5 h-5" />
                </motion.button>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-2"></div>
                <motion.button onClick={() => adjustFontSize(false)} disabled={fontSize <= 12} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50" title="Decrease Font Size">
                  <span className="text-sm font-bold">A-</span>
                </motion.button>
                <motion.button onClick={() => adjustFontSize(true)} disabled={fontSize >= 32} className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50" title="Increase Font Size">
                  <span className="text-lg font-bold">A+</span>
                </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => navigateLesson('prev')} disabled={currentLessonIndex === 0} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" /> <span className="hidden md:inline">Prev</span>
            </button>
            <span className="text-sm font-medium w-20 text-center">{currentLessonIndex + 1} / {unit.lessons.length}</span>
            <button onClick={() => navigateLesson('next')} disabled={currentLessonIndex >= unit.lessons.length - 1} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50">
              <span className="hidden md:inline">Next</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={onExitClassroom} className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <X className="w-4 h-4" /> <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Main Lesson Content */}
          <div className="flex-1 relative p-4 sm:p-6 md:p-8 overflow-y-auto">
            <motion.div
              key={currentLesson?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 md:mb-8" style={{ fontSize: `${fontSize + 12}px` }}>
                {currentLesson?.title}
              </h1>
              <div 
                className="prose dark:prose-invert max-w-none leading-relaxed text-gray-700 dark:text-gray-300"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: currentLesson?.content || '' }}
              />
            </motion.div>
          </div>
          
          {/* Drawing Canvas Overlay */}
          <AnimatePresence>
            {penActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 pointer-events-auto"
              >
                <CanvasDraw
                  ref={canvasRef}
                  brushColor="#ef4444" // Red-500
                  brushRadius={3}
                  lazyRadius={0}
                  canvasWidth={2000}
                  canvasHeight={2000}
                  hideGrid={true}
                  className="w-full h-full"
                  style={{ background: 'transparent' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClassroomView;
