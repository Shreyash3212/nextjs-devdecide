// lib/markdown.js
import dbConnect from "./mongodb";
import Blog from "@/models/Blog";
import Review from "@/models/Review";
import Comparison from "@/models/Comparison";

// ==========================================
// BLOG FETCHERS
// ==========================================
export async function getAllBlogs() {
  await dbConnect();
  const blogs = await Blog.find({}).sort({ date: -1 }).lean();

  // We map the MongoDB document to match the old gray-matter structure
  // so your frontend components don't break!
  return blogs.map((blog) => ({
    slug: blog.slug,
    frontmatter: {
      title: blog.title,
      date: blog.date,
      summary: blog.summary,
      trending: blog.trending,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords,
    },
  }));
}

export async function getBlogBySlug(slug) {
  await dbConnect();
  const blog = await Blog.findOne({ slug }).lean();
  if (!blog) return null;

  return {
    slug: blog.slug,
    frontmatter: {
      title: blog.title,
      date: blog.date,
      summary: blog.summary,
      trending: blog.trending,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      metaKeywords: blog.metaKeywords,
    },
    content: blog.content, // The raw markdown string from the database
  };
}

// ==========================================
// REVIEW FETCHERS
// ==========================================
export async function getAllReviews() {
  await dbConnect();
  const reviews = await Review.find({}).sort({ date: -1 }).lean();

  return reviews.map((review) => ({
    slug: review.slug,
    frontmatter: {
      title: review.title,
      date: review.date,
      summary: review.summary,
      rating: review.rating,
      reviewCount: review.reviewCount,
      price: review.price,
      trending: review.trending,
      metaTitle: review.metaTitle,
      metaDescription: review.metaDescription,
      metaKeywords: review.metaKeywords,
    },
  }));
}

export async function getReviewBySlug(slug) {
  await dbConnect();
  const review = await Review.findOne({ slug }).lean();
  if (!review) return null;

  return {
    slug: review.slug,
    frontmatter: {
      title: review.title,
      date: review.date,
      summary: review.summary,
      rating: review.rating,
      reviewCount: review.reviewCount,
      price: review.price,
      trending: review.trending,
      metaTitle: review.metaTitle,
      metaDescription: review.metaDescription,
      metaKeywords: review.metaKeywords,
    },
    content: review.content,
  };
}

// ==========================================
// COMPARISON FETCHERS
// ==========================================
export async function getAllComparisons() {
  await dbConnect();
  const comparisons = await Comparison.find({}).sort({ date: -1 }).lean();

  return comparisons.map((comp) => ({
    slug: comp.slug,
    frontmatter: {
      tool1: comp.tool1,
      tool2: comp.tool2,
      date: comp.date,
      summary: comp.summary,
      winner: comp.winner,
      trending: comp.trending,
      metaTitle: comp.metaTitle,
      metaDescription: comp.metaDescription,
      metaKeywords: comp.metaKeywords,
    },
  }));
}

export async function getComparisonBySlug(slug) {
  await dbConnect();
  const comp = await Comparison.findOne({ slug }).lean();
  if (!comp) return null;

  return {
    slug: comp.slug,
    frontmatter: {
      tool1: comp.tool1,
      tool2: comp.tool2,
      date: comp.date,
      summary: comp.summary,
      winner: comp.winner,
      table: comp.table, // The JSON array for the comparison table
      trending: comp.trending,
      metaTitle: comp.metaTitle,
      metaDescription: comp.metaDescription,
      metaKeywords: comp.metaKeywords,
    },
    content: comp.content,
  };
}
