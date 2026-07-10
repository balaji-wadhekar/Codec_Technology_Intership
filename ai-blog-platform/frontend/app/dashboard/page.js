'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenTool, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(p => p._id !== id));
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Error deleting post');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <main>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Author Dashboard</h1>
          <p className="text-gray-600">Manage your drafts and published content</p>
        </div>
        <Link href="/editor" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
          <PenTool size={18} />
          Create New Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Metrics</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {post.title}
                    {post.isPremium && <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Premium</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs">SEO: {post.seoScore}/100</span>
                      <span className="text-xs text-gray-400">{post.readingTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {post.status === 'published' && (
                        <Link href={`/post/${post._id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="View Article">
                          <ExternalLink size={18} />
                        </Link>
                      )}
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Edit Post">
                        <PenTool size={18} />
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete Post">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No posts found. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
