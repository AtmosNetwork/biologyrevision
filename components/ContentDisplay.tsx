
import React from 'react';

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content }) => {
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    // Fix: Use React.ReactNode to avoid relying on a global JSX namespace.
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-700 dark:text-gray-300">
            {listItems.map((item, index) => (
              <li key={`li-${index}`} dangerouslySetInnerHTML={{ __html: parseInlineFormatting(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };
    
    lines.forEach((line, index) => {
        line = line.trim();

        if (line.startsWith('###')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line.replace('###', '')) }} />);
        } else if (line.startsWith('##')) {
            flushList();
            elements.push(<h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b-2 border-indigo-500 pb-2 text-gray-900 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line.replace('##', '')) }} />);
        } else if (line.startsWith('#')) {
            flushList();
            elements.push(<h1 key={index} className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line.replace('#', '')) }} />);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            inList = true;
            listItems.push(line.substring(2));
        } else if (line.startsWith('ANSWER:')) {
            flushList();
            elements.push(<div key={index} className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg mt-2 mb-4 border-l-4 border-indigo-500"><p className="font-semibold text-indigo-800 dark:text-indigo-300">Answer:</p><p className="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line.replace('ANSWER:', '')) }} /></div>);
        } else if (line.length > 0) {
            flushList();
            elements.push(<p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseInlineFormatting(line) }} />);
        }
    });

    flushList(); // Add any remaining list items
    return elements;
  };
  
  const parseInlineFormatting = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
  };

  return (
    <div className="prose prose-indigo dark:prose-invert max-w-none animate-fade-in">
        {parseContent(content)}
    </div>
  );
};

export default ContentDisplay;
