// app/reviews/page.js
import { getAllReviews } from '@/lib/markdown';
import Link from 'next/link';

export const metadata = {
  title: 'B2B SaaS & Developer Tool Reviews | DevDecide',
  description: 'Unbiased, deep-dive reviews of the best CRM, cloud infrastructure, and developer tools on the market.',
};

export default async function ReviewsIndex() {
  const reviews = await getAllReviews();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Software Reviews
        </h1>
        <p className="text-xl text-gray-600">
          In-depth technical breakdowns, pricing analysis, and developer experience ratings.
        </p>
      </header>

      {/* Updated Grid to match the dark-mode homepage cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <Link 
            key={review.slug} 
            href={`/reviews/${review.slug}`} 
            className="flex flex-col justify-between p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white hover:scale-[1.02] transition-transform h-full"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
                  Software Review
                </span>
                <span className="text-xs font-bold text-gray-900 bg-yellow-400 px-2 py-1 rounded">
                  ⭐ {review.frontmatter.rating} / 5
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-4">{review.frontmatter.title}</h2>
              <p className="text-gray-300 line-clamp-3">{review.frontmatter.summary}</p>
            </div>
            <div className="mt-8 text-sm font-semibold text-blue-300 flex items-center gap-2">
              Read the full review →
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}