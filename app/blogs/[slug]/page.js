// app/blogs/[slug]/page.js
import { getBlogBySlug } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  if (!blog) return { title: 'Post Not Found' };

  // 1. Convert the comma-separated keywords string into a proper array
  const keywordArray = blog.frontmatter.metaKeywords 
    ? blog.frontmatter.metaKeywords.split(',').map(k => k.trim())
    : [blog.frontmatter.title, 'SaaS', 'Developer'];

  return {
    // 2. Use the custom SEO fields, or fall back to the defaults
    title: blog.frontmatter.metaTitle || blog.frontmatter.title, 
    description: blog.frontmatter.metaDescription || blog.frontmatter.summary,
    keywords: keywordArray,
  };
}

export default async function BlogPage({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  if (!blog) notFound();

  const { frontmatter, content } = blog;

  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <article>
        <header className="mb-10 border-b pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {frontmatter.title}
          </h1>
          <div className="text-sm font-medium text-gray-500">
            Published: {frontmatter.date}
          </div>
        </header>

        <div className="prose prose-lg prose-blue max-w-none text-gray-800">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    {...props}
                    style={prism}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg !my-6 text-sm border border-gray-200"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono text-sm">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}