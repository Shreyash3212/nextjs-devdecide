// app/blogs/page.js
import { getAllBlogs } from '@/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'All B2B Tech Blogs & Guides | DevDecide',
  description: 'Read all of our technical guides, SEO strategies, and B2B SaaS architecture deep dives.',
};

export default async function BlogsIndex() {
  const blogs = await getAllBlogs();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          All Tech Blogs & Guides
        </h1>
        <p className="text-xl text-gray-600">
          Everything you need to know about scaling B2B SaaS, from architecture to marketing.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link 
            key={blog.slug} 
            href={`/blogs/${blog.slug}`} 
            className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Article
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">{blog.frontmatter.title}</h2>
            <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">{blog.frontmatter.summary}</p>
            <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
              Read article →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}