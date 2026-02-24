// app/comparisons/[tools]/page.js
import { getComparisonBySlug } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const comp = await getComparisonBySlug(resolvedParams.slug);

  if (!comp) return { title: 'Comparison Not Found' };

  // 1. Convert the comma-separated keywords string into a proper array
  const keywordArray = comp.frontmatter.metaKeywords 
    ? comp.frontmatter.metaKeywords.split(',').map(k => k.trim())
    : [comp.frontmatter.tool1, comp.frontmatter.tool2, 'Comparison', 'Alternatives'];

  return {
    // 2. Use the custom SEO fields, or fall back to the defaults
    title: comp.frontmatter.metaTitle || `${comp.frontmatter.tool1} vs ${comp.frontmatter.tool2}`, 
    description: comp.frontmatter.metaDescription || comp.frontmatter.summary,
    keywords: keywordArray,
  };
}

export default async function ComparisonPage({ params }) {
  const resolvedParams = await params;
  const comparison = await getComparisonBySlug(resolvedParams.tools);

  if (!comparison) notFound();

  const { frontmatter, content } = comparison;

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {frontmatter.tool1} <span className="text-gray-400">vs</span> {frontmatter.tool2}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{frontmatter.summary}</p>
      </header>

      {/* The Verdict Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 mb-12 text-center">
        <h2 className="text-2xl font-semibold text-blue-900 mb-2">The Verdict</h2>
        <p className="text-blue-800 text-lg">
          For most B2B use cases, <strong>{frontmatter.winner}</strong> is the better choice.
        </p>
      </div>

      {/* Programmatic Comparison Table from Frontmatter */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Feature Breakdown</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{frontmatter.tool1}</th>
                <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{frontmatter.tool2}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {frontmatter.table.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.feature}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.valA}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.valB}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* The Rich Markdown Content */}
      <article className="prose prose-lg prose-blue max-w-none text-gray-800 border-t pt-12">
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
      </article>
    </main>
  );
}