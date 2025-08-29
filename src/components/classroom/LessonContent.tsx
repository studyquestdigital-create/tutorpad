import React from 'react';
import { motion } from 'framer-motion';
import { Play, Image, FileText } from 'lucide-react';

const LessonContent: React.FC = () => {
  const demoContent = {
    title: "Introduction to Solar System",
    sections: [
      {
        type: 'text',
        content: "The solar system consists of the Sun and all celestial objects that orbit around it. This includes eight planets, their moons, asteroids, comets, and other space debris."
      },
      {
        type: 'image',
        url: 'https://img-wrapper.vercel.app/image?url=https://placehold.co/600x300/4f46e5/ffffff?text=Solar+System+Diagram',
        caption: 'Our Solar System with eight planets'
      },
      {
        type: 'text',
        content: "The planets are divided into two main categories: terrestrial planets (Mercury, Venus, Earth, Mars) and gas giants (Jupiter, Saturn, Uranus, Neptune)."
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/embed/0rHUDWjR5gg',
        title: 'Solar System Overview'
      }
    ]
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{demoContent.title}</h2>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Interactive Lesson
            </span>
            <span>•</span>
            <span>Grade 6 Science</span>
          </div>
        </div>

        {demoContent.sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {section.type === 'text' && (
              <div className="p-6">
                <p className="text-lg leading-relaxed text-gray-700">{section.content}</p>
              </div>
            )}

            {section.type === 'image' && (
              <div>
                <img
                  src={section.url}
                  alt={section.caption}
                  className="w-full h-64 object-cover"
                />
                {section.caption && (
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      {section.caption}
                    </p>
                  </div>
                )}
              </div>
            )}

            {section.type === 'video' && (
              <div>
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={section.url}
                    title={section.title}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    {section.title}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Interactive Features</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Use the pen tool on the right to annotate and highlight content</li>
            <li>• Draw directly on the lesson to emphasize important points</li>
            <li>• Save your annotations for later reference</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default LessonContent;
