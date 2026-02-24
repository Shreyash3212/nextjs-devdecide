import Link from "next/link";
import { getAllReviews, getAllBlogs, getAllComparisons } from "@/lib/markdown";
import NewsletterForm from "@/components/NewsletterForm";

export default async function Home() {
  const allComparisons = await getAllComparisons();
  const recentComparisons = allComparisons
    .filter((comp) => comp.frontmatter.trending === true)
    .slice(0, 3);
    
  const allReviews = await getAllReviews();
  const recentReviews = allReviews
    .filter((review) => review.frontmatter.trending === true)
    .slice(0, 2);
    
  const allBlogs = await getAllBlogs();
  const recentBlogs = allBlogs
    .filter((blog) => blog.frontmatter.trending === true)
    .slice(0, 3);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Find the perfect software <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            for your dev team.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          We analyze, test, and compare the best B2B SaaS tools, APIs, and cloud
          infrastructure so you can build faster and scale smarter.
        </p>
      </section>

      {/* Conditionally render Trending Blogs Grid */}
      {recentBlogs.length > 0 && (
        <section id="blogs" className="mb-20 pt-20 -mt-20">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">
            Trending Blogs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                  Article
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {blog.frontmatter.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                  {blog.frontmatter.summary}
                </p>
                <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                  Read article →
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View all blogs →
            </Link>
          </div>
        </section>
      )}

      {/* Conditionally render Trending Comparisons Grid */}
      {recentComparisons.length > 0 && (
        <section id="comparisons" className="mb-20 pt-20 -mt-20">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">
            Trending Comparisons
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentComparisons.map((comp) => (
              <Link
                key={comp.slug}
                href={`/comparisons/${comp.slug}`}
                className="group block p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full"
              >
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                  Comparison
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 mb-3">
                  {comp.frontmatter.tool1} vs {comp.frontmatter.tool2}
                </h3>
                <p className="text-sm text-gray-600 flex-grow line-clamp-3 mb-4">
                  {comp.frontmatter.summary}
                </p>
                <div className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                  See the verdict →
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/comparisons"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View all comparisons →
            </Link>
          </div>
        </section>
      )}

      {/* Conditionally render Latest Reviews Grid */}
      {recentReviews.length > 0 && (
        <section id="reviews" className="mb-20 pt-20 -mt-20">
          <h2 className="text-3xl font-bold mb-8 border-b pb-4">
            Deep Dive Reviews
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {recentReviews.map((review) => (
              <Link
                key={review.slug}
                href={`/reviews/${review.slug}`}
                className="flex flex-col justify-between p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white hover:scale-[1.02] transition-transform"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 block">
                    Software Review
                  </span>
                  <h3 className="text-2xl font-bold mb-4">
                    {review.frontmatter.title}
                  </h3>
                  <p className="text-gray-300 line-clamp-3">
                    {review.frontmatter.summary}
                  </p>
                </div>
                <div className="mt-8 text-sm font-semibold text-blue-300 flex items-center gap-2">
                  Read the full review →
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View all reviews →
            </Link>
          </div>
        </section>
      )}

      {/* Newsletter Form */}
      <NewsletterForm />
    </main>
  );
}