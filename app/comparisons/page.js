// app/comparisons/page.js
import { getAllComparisons } from '@/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'Software Comparisons & Alternatives | DevDecide',
  description: 'Head-to-head comparisons of top B2B SaaS platforms to help you choose the right stack.',
};

export default async function ComparisonsIndex() {
  const comparisons = await getAllComparisons();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Head-to-Head Comparisons
        </h1>
        <p className="text-xl text-gray-600">
          Feature breakdowns and technical verdicts to help you choose the right platform.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisons.map((comp) => (
          <Link 
            key={comp.slug} 
            href={`/comparisons/${comp.slug}`}
            className="group block p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Comparison
            </div>
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-3">
              {comp.frontmatter.tool1} vs {comp.frontmatter.tool2}
            </h2>
            <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-4">
              {comp.frontmatter.summary}
            </p>
            <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
              See the verdict →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}