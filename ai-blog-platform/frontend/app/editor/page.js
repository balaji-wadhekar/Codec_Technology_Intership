'use client';

import { useState } from 'react';
import { Sparkles, BarChart, Save, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdvancedEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  
  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [seoResult, setSeoResult] = useState(null);

  const handleAskAI = async () => {
    if (!topic) return toast.error('Please enter a topic to generate content');
    
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (res.ok) {
        setContent(prev => prev + data.content);
        toast.success('AI content appended!');
      } else {
        toast.error('Failed to generate content');
      }
    } catch (error) {
      toast.error('An error occurred while calling AI');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeSEO = async () => {
    if (!content) return toast.error('Please write some content to analyze');
    
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (res.ok) {
        setSeoResult(data);
        toast.success('SEO Analysis complete');
      } else {
        toast.error('Failed to analyze SEO');
      }
    } catch (error) {
      toast.error('An error occurred during SEO analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (status) => {
    if (!title) return toast.error('Please enter a title');
    
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          status,
          tags: ['AI', 'Tech'], // Defaulting for demo
          isPremium: false,
          seoScore: seoResult?.score || 0,
          readingTime: '2 min read'
        })
      });
      if (res.ok) {
        toast.success(`Post ${status === 'published' ? 'Published' : 'Saved as Draft'}!`);
        router.push('/dashboard');
      } else {
        toast.error('Failed to save post');
      }
    } catch (error) {
      toast.error('Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full">
          <input 
            type="text" 
            placeholder="Article Title..." 
            className="w-full text-4xl font-extrabold bg-transparent focus:outline-none placeholder-gray-300"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors"
          >
            <Send size={18} />
            Publish
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white border border-gray-200 rounded-t-xl p-3 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Topic for AI generation..." 
            className="flex-1 md:w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
          <button 
            onClick={handleAskAI}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Auto-Write Content
          </button>
        </div>
        
        <button 
          onClick={handleAnalyzeSEO}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <BarChart size={16} />}
          Analyze SEO
        </button>
      </div>

      {/* Editor & Preview Side-by-Side */}
      <div className="flex-1 flex flex-col lg:flex-row border border-t-0 border-gray-200 rounded-b-xl overflow-hidden bg-white">
        
        {/* Left Side: Editor */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative flex flex-col">
          <div className="absolute top-0 right-0 p-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Markdown Input</span>
          </div>
          <textarea 
            className="flex-1 w-full p-6 pt-10 resize-none focus:outline-none font-mono text-gray-700 text-sm md:text-base leading-relaxed"
            placeholder="Start typing your markdown masterpiece here..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        {/* Right Side: Live Preview & SEO Widget */}
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="relative flex-1 p-6 overflow-y-auto">
            <div className="absolute top-0 right-0 p-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest bg-white border border-gray-200 px-2 py-1 rounded">Live Preview</span>
            </div>
            {content ? (
              <div className="prose prose-blue max-w-none pt-4">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic pt-4">
                Preview will appear here...
              </div>
            )}
          </div>
          
          {/* SEO Result Card */}
          {seoResult && (
            <div className="m-4 p-5 bg-white border border-emerald-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <BarChart size={18} className="text-emerald-600" />
                  SEO Analysis
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${seoResult.score >= 90 ? 'bg-emerald-100 text-emerald-800' : seoResult.score >= 70 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                  Score: {seoResult.score}/100
                </span>
              </div>
              <ul className="space-y-2">
                {seoResult.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-emerald-500 mt-0.5">•</span> {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
