import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

// Dynamic metadata based on the post
export async function generateMetadata({ params }) {
  const { id } = await params;
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    return { title: 'Post Not Found' };
  }
  const post = await res.json();
  return {
    title: `${post.title} | AI Blog Platform`,
    description: `Read ${post.title} on AI Blog Platform`,
  };
}

async function getPost(id) {
  const res = await fetch(`http://localhost:5000/api/posts/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block">&larr; Back to Home</Link>
      
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          {post.isPremium && (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
              Premium Content
            </span>
          )}
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
            SEO Score: {post.seoScore}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{post.title}</h1>
      </header>

      <div className="prose prose-blue max-w-none">
        {post.isPremium ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-amber-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Content</h3>
            <p className="text-gray-600 mb-6">Subscribe to read this premium content and gain full access to all our exclusive articles.</p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
              Subscribe Now
            </button>
          </div>
        ) : (
          <ReactMarkdown>{post.content}</ReactMarkdown>
        )}
      </div>
    </main>
  );
}
