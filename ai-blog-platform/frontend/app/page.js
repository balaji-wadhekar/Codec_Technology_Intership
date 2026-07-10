import Link from 'next/link';
import { Clock, Lock, ArrowRight, Tag } from 'lucide-react';

export const metadata = {
  title: 'AI Blog Platform | Home',
  description: 'A minimal AI-Powered Blogging Platform',
};

async function getPosts() {
  const res = await fetch('http://localhost:5000/api/posts', {
    cache: 'no-store'
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Home() {
  const allPosts = await getPosts();
  const posts = allPosts.filter(p => p.status === 'published');

  return (
    <main>
      <header className="mb-12 text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
          Explore the <span className="text-blue-600">Future</span> of Content
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover insights, tutorials, and AI-generated masterpieces curated for you.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 border border-blue-100">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
                {post.isPremium && (
                  <span className="text-amber-500 bg-amber-50 p-1.5 rounded-full" title="Premium Content">
                    <Lock size={16} />
                  </span>
                )}
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                <Link href={`/post/${post._id}`}>
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                {post.content.replace(/[#*`]/g, '').substring(0, 150)}...
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500 gap-1 font-medium">
                  <Clock size={16} className="text-gray-400" />
                  {post.readingTime}
                </div>
                <Link href={`/post/${post._id}`} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-xl text-gray-500 font-medium">No published posts found yet.</p>
          <Link href="/editor" className="text-blue-600 hover:underline mt-2 inline-block">Be the first to write one!</Link>
        </div>
      )}
    </main>
  );
}
