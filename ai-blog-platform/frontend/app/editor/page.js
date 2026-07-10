'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EditorPage() {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    if (!topic) {
      alert('Please enter a topic first');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (res.ok) {
        setContent((prev) => prev + (prev ? '\n\n' : '') + data.content);
      } else {
        alert(data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while calling AI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Editor</h1>
          <p className="text-gray-600">Draft your next masterpiece with AI</p>
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </header>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <input 
            type="text" 
            placeholder="Enter a topic for AI..." 
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button 
            onClick={handleAskAI}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Ask AI for Suggestions
              </>
            )}
          </button>
        </div>
        
        <textarea 
          className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-gray-800"
          placeholder="Start typing your markdown content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </main>
  );
}
