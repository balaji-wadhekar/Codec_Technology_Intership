import Link from 'next/link';

export const metadata = {
  title: 'AI Blog Platform | Home',
  description: 'A minimal AI-Powered Blogging Platform',
};

async function getPosts() {
  const res = await fetch('http://localhost:5000/api/posts', {
    cache: 'no-store' // Ensure SSR
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">AI Blog Platform</h1>
          <p className="text-gray-600">Discover AI-generated content</p>
        </div>
        <Link 
          href="/editor" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          AI Editor
        </Link>
      </header>
      
      <div className="grid gap-6">
        {posts.map(post => (
          <article key={post._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold">
                <Link href={`/post/${post._id}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              {post.isPremium && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                  Premium
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="bg-gray-100 px-2 py-1 rounded">SEO Score: {post.seoScore}/100</span>
            </div>
            <p className="text-gray-600 line-clamp-2">
              {post.content.replace(/[#*]/g, '').substring(0, 150)}...
            </p>
            <div className="mt-4">
              <Link href={`/post/${post._id}`} className="text-blue-600 hover:underline font-medium">
                Read Article &rarr;
              </Link>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">No posts found. Is the backend running?</p>
        )}
      </div>
    </main>
  );
}
