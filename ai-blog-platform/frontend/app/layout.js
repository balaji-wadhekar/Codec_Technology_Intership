import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { PenTool, LayoutDashboard, Home, BookOpen } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Blog Platform',
  description: 'A Next-Generation AI Blogging Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    AI Blog Platform
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                  <Home size={18} />
                  Home
                </Link>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors">
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link href="/editor" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm">
                  <PenTool size={18} />
                  Write Post
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
        
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
