import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Loader, 
  Edit3, 
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Image as ImageIcon,
  Video,
  Upload
} from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Course, Subject, Unit, Lesson } from '../../types';
import * as api from '../../lib/api';
import RichTextEditor from './RichTextEditor';

interface LessonTopic {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaTitle?: string;
}

interface UnitWithTopics extends Unit {
  topics: LessonTopic[];
}

const LessonEditor: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [units, setUnits] = useState<UnitWithTopics[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  
  // Unit creation state
  const [unitName, setUnitName] = useState('');
  const [unitDescription, setUnitDescription] = useState('');
  const [numLessons, setNumLessons] = useState(1);
  
  // Lesson creation state
  const [lessonTitle, setLessonTitle] = useState('');
  const [topics, setTopics] = useState<LessonTopic[]>([]);
  
  // UI state
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [editingUnit, setEditingUnit] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, subjectsData, unitsData] = await Promise.all([
          api.getCourses(),
          api.getSubjects(),
          api.getUnits()
        ]);
        setCourses(coursesData);
        setSubjects(subjectsData);
        
        // Convert units to include topics
        const unitsWithTopics = unitsData.map(unit => ({
          ...unit,
          topics: unit.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            type: 'text' as const,
          }))
        }));
        setUnits(unitsWithTopics);
        
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].id);
        }
      } catch (error) {
        toast.error('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedCourse = useMemo(() => courses.find(c => c.id === selectedCourseId), [selectedCourseId, courses]);
  const availableTerms = useMemo(() => selectedCourse ? Array.from({ length: selectedCourse.terms }, (_, i) => i + 1) : [], [selectedCourse]);
  const availableSubjects = useMemo(() => {
    return subjects.filter(s => s.course_id === selectedCourseId && s.term === selectedTerm);
  }, [selectedCourseId, selectedTerm, subjects]);

  const filteredUnits = useMemo(() => {
    return units.filter(unit => unit.subject === availableSubjects.find(s => s.id === selectedSubjectId)?.name);
  }, [units, selectedSubjectId, availableSubjects]);

  const addTopic = () => {
    const newTopic: LessonTopic = {
      id: uuidv4(),
      title: '',
      content: '',
      type: 'text'
    };
    setTopics([...topics, newTopic]);
  };

  const updateTopic = (topicId: string, updates: Partial<LessonTopic>) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, ...updates } : topic
    ));
  };

  const deleteTopic = (topicId: string) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName || !selectedSubjectId) return;
    
    setIsSubmitting(true);
    try {
      const newUnit = await api.createUnit({
        title: unitName,
        description: unitDescription,
        course_id: selectedCourseId,
        subject_id: selectedSubjectId,
        lessons: [],
        progress: 0,
        status: 'draft'
      });
      
      // Add to local state
      const unitWithTopics: UnitWithTopics = {
        ...newUnit,
        course: selectedCourse?.name || '',
        subject: availableSubjects.find(s => s.id === selectedSubjectId)?.name || '',
        term: selectedTerm,
        lastModified: new Date().toLocaleDateString('en-CA'),
        topics: []
      };
      setUnits([...units, unitWithTopics]);
      
      // Reset form
      setUnitName('');
      setUnitDescription('');
      setNumLessons(1);
      
      toast.success('Unit created successfully!');
    } catch (error) {
      toast.error('Failed to create unit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleUnitExpansion = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Lesson Creation</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Create and manage comprehensive lessons with rich content</p>
      </div>

      {/* Course, Term, Subject Selection */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Context</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course</label>
            <select 
              value={selectedCourseId} 
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {selectedCourse?.name.includes('GNM') ? 'Year' : 'Semester'}
            </label>
            <select 
              value={selectedTerm} 
              onChange={e => setSelectedTerm(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
            >
              {availableTerms.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <select 
              value={selectedSubjectId} 
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select Subject</option>
              {availableSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Existing Units Display */}
      {selectedSubjectId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Existing Units ({filteredUnits.length})
          </h4>
          
          {filteredUnits.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No units found for this subject. Create your first unit below.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredUnits.map(unit => (
                <div key={unit.id} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-primary-500" />
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{unit.title}</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {unit.lessons.length} lesson{unit.lessons.length !== 1 ? 's' : ''} • {unit.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingUnit(editingUnit === unit.id ? null : unit.id)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleUnitExpansion(unit.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors"
                        >
                          {expandedUnits.has(unit.id) ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </div>
                    
                    {expandedUnits.has(unit.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                      >
                        <div className="space-y-2">
                          {unit.lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <span className="w-6 h-6 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">{lesson.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {lesson.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                </p>
                              </div>
                              <button className="p-2 text-gray-400 hover:text-primary-600 rounded-lg">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Unit Creation Form */}
      {selectedSubjectId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Unit</h4>
          
          <form onSubmit={handleCreateUnit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Name</label>
                <input
                  type="text"
                  value={unitName}
                  onChange={e => setUnitName(e.target.value)}
                  placeholder="e.g., Introduction to Cell Biology"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Lessons</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numLessons}
                  onChange={e => setNumLessons(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit Description</label>
              <textarea
                value={unitDescription}
                onChange={e => setUnitDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of what this unit covers..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              {isSubmitting ? 'Creating Unit...' : 'Create Unit'}
            </motion.button>
          </form>
        </div>
      )}

      {/* Lesson Creation Form */}
      {selectedSubjectId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create Lesson Content</h4>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lesson Title</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={e => setLessonTitle(e.target.value)}
                placeholder="e.g., Cell Structure and Function"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Topics Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-md font-medium text-gray-900 dark:text-white">Lesson Topics</h5>
                <button
                  type="button"
                  onClick={addTopic}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Topic
                </button>
              </div>

              <div className="space-y-4">
                {topics.map((topic, index) => (
                  <TopicEditor
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onUpdate={(updates) => updateTopic(topic.id, updates)}
                    onDelete={() => deleteTopic(topic.id)}
                  />
                ))}
                
                {topics.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No topics added yet. Click "Add Topic" to start.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Lesson Button */}
            {lessonTitle && topics.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Lesson
              </motion.button>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader className="w-6 h-6 animate-spin text-primary-500" />
        </div>
      )}
    </div>
  );
};

interface TopicEditorProps {
  topic: LessonTopic;
  index: number;
  onUpdate: (updates: Partial<LessonTopic>) => void;
  onDelete: () => void;
}

const TopicEditor: React.FC<TopicEditorProps> = ({ topic, index, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <input
              type="text"
              value={topic.title}
              onChange={e => onUpdate({ title: e.target.value })}
              placeholder="Topic title..."
              className="font-medium bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={topic.type}
              onChange={e => onUpdate({ type: e.target.value as 'text' | 'image' | 'video' })}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-500 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white dark:bg-gray-800">
          {topic.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
              <RichTextEditor
                content={topic.content}
                onChange={(content) => onUpdate({ content })}
                placeholder="Write your lesson content here..."
              />
            </div>
          )}

          {topic.type === 'image' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                <input
                  type="url"
                  value={topic.mediaUrl || ''}
                  onChange={e => onUpdate({ mediaUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Caption</label>
                <input
                  type="text"
                  value={topic.mediaTitle || ''}
                  onChange={e => onUpdate({ mediaTitle: e.target.value })}
                  placeholder="Image description..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Notes</label>
                <RichTextEditor
                  content={topic.content}
                  onChange={(content) => onUpdate({ content })}
                  placeholder="Add notes about this image..."
                />
              </div>
            </div>
          )}

          {topic.type === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YouTube Video URL</label>
                <input
                  type="url"
                  value={topic.mediaUrl || ''}
                  onChange={e => onUpdate({ mediaUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Title</label>
                <input
                  type="text"
                  value={topic.mediaTitle || ''}
                  onChange={e => onUpdate({ mediaTitle: e.target.value })}
                  placeholder="Video title..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Video Upload</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Direct video upload feature coming soon</p>
                </div>
                <button
                  type="button"
                  disabled
                  className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-lg opacity-50 cursor-not-allowed"
                >
                  Upload Video
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Notes</label>
                <RichTextEditor
                  content={topic.content}
                  onChange={(content) => onUpdate({ content })}
                  placeholder="Add notes about this video..."
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonEditor;