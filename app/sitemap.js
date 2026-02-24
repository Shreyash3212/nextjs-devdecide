// app/sitemap.js
import { getAllReviews, getAllBlogs, getAllComparisons } from '@/lib/markdown'; // 1. Added getAllComparisons

export default async function sitemap() {
  const baseUrl = 'https://devdecide.com'; // Update this before you go live!

  // 1. Get all your dynamic Markdown reviews
  const reviews = await getAllReviews();
  const reviewUrls = reviews.map((review) => ({
    url: `${baseUrl}/reviews/${review.slug}`,
    lastModified: new Date(review.frontmatter.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 2. Get all your dynamic Markdown standard blogs
  const blogs = await getAllBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.frontmatter.date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. NEW: Get all your dynamic Markdown comparisons
  const comparisons = await getAllComparisons();
  const comparisonUrls = comparisons.map((comp) => ({
    url: `${baseUrl}/comparisons/${comp.slug}`,
    lastModified: new Date(comp.frontmatter.date), // Now dynamically pulling the date you wrote in the frontmatter!
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 4. Define your static core pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, 
    }
  ];

  // Combine everything into one automated sitemap
  return [...staticRoutes, ...reviewUrls, ...blogUrls, ...comparisonUrls];
}