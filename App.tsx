
import React, { useState, useCallback } from 'react';
import { BIOLOGY_TOPICS } from './constants';
import { generateRevisionContent } from './services/geminiService';
import { DNAIcon, BookOpenIcon, HelpCircleIcon, ZapIcon } from './components/Icons';
import LoadingSpinner from './components/LoadingSpinner';
import ContentDisplay from './components/ContentDisplay';

type RevisionType = 'summary' | 'questions' | 'explain';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string>(BIOLOGY_TOPICS[0]);
  const [revisionType, setRevisionType] = useState<RevisionType>('summary');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (!selectedTopic || (revisionType === 'explain' && !customPrompt)) {
      setError('Please select a topic and provide a concept to explain.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const content = await generateRevisionContent(selectedTopic, revisionType, customPrompt);
      setGeneratedContent(content);
    } catch (e) {
      console.error(e);
      setError('Failed to generate content. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTopic, revisionType, customPrompt]);
  
  const getButtonClass = (type: RevisionType) =>
    `flex-1 text-sm md:text-base text-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 ${
      revisionType === type
        ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex justify-center items-center gap-4">
            <DNAIcon className="w-12 h-12 text-indigo-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              AQA A-Level Biology Revision Helper
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Your AI-powered study partner for mastering AQA Biology.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Section */}
          <aside className="lg:col-span-1 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-fit sticky top-8">
            <h2 className="text-2xl font-semibold border-b-2 border-indigo-500 pb-2">Revise a Topic</h2>
            <div>
              <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                1. Select Topic
              </label>
              <select
                id="topic-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                {BIOLOGY_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                2. Choose Revision Type
              </span>
              <div className="flex flex-col md:flex-row gap-2">
                 <button onClick={() => setRevisionType('summary')} className={getButtonClass('summary')}>
                   <BookOpenIcon className="w-5 h-5 mr-2 inline-block"/> Summary
                 </button>
                 <button onClick={() => setRevisionType('questions')} className={getButtonClass('questions')}>
                   <HelpCircleIcon className="w-5 h-5 mr-2 inline-block"/> Questions
                 </button>
              </div>
               <div className="mt-2">
                 <button onClick={() => setRevisionType('explain')} className={getButtonClass('explain')}>
                   <ZapIcon className="w-5 h-5 mr-2 inline-block"/> Explain Concept
                 </button>
               </div>
            </div>

            {revisionType === 'explain' && (
              <div className="animate-fade-in">
                <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  3. What concept needs explaining?
                </label>
                <input
                  id="custom-prompt"
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., 'the role of ATP' or 'synaptic transmission'"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            )}
            
            <button
              onClick={handleGenerateClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Generating...
                </>
              ) : (
                <>
                  <ZapIcon className="w-5 h-5 mr-2"/>
                  Generate Content
                </>
              )}
            </button>
          </aside>

          {/* Content Section */}
          <section className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg min-h-[60vh]">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            {!isLoading && !generatedContent && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full mb-4">
                    <BookOpenIcon className="w-16 h-16 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-semibold">Ready to Revise?</h3>
                <p className="max-w-md mt-2">Select a topic and a revision type, then click "Generate Content" to get started.</p>
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Generating your revision materials...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
              </div>
            )}

            {generatedContent && (
              <ContentDisplay content={generatedContent} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
