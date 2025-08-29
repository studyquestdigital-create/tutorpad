import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 hover:text-primary-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYouTubeVideo = () => {
    const url = window.prompt('Enter YouTube URL:');
    if (url && editor) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('heading', { level: 1 }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('heading', { level: 2 }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('heading', { level: 3 }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('bold') ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('italic') ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('bulletList') ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('orderedList') ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive('blockquote') ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-300'
              }`}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1">
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={addYouTubeVideo}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
              title="Add YouTube Video"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={addLink}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border-t border-gray-200 dark:border-gray-600">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] focus-within:bg-gray-50 dark:focus-within:bg-gray-700/30 transition-colors"
        />
      </div>
      
      {!content && (
        <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
          <p className="text-gray-400 dark:text-gray-500">{placeholder}</p>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;