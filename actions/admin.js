"use server"; // This directive is critical. It ensures this code NEVER ships to the browser.

import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Review from "@/models/Review";
import Comparison from "@/models/Comparison";
import { revalidatePath } from "next/cache";

// 1. READ: Fetch all blogs for the admin dashboard
export async function getAdminBlogs() {
  await dbConnect();
  try {
    // .lean() converts complex Mongoose documents into plain JavaScript objects
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();

    // We have to parse and stringify to safely pass the MongoDB _id to the client
    return JSON.parse(JSON.stringify(blogs));
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// 2. CREATE: Add a new blog to the database
export async function createBlog(formData) {
  await dbConnect();

  try {
    // Extract data directly from the frontend form
    const newBlog = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      date: formData.get("date"),
      summary: formData.get("summary"),
      content: formData.get("content"),
      trending: formData.get("trending") === "on", // Checkboxes return "on" if checked
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      metaKeywords: formData.get("metaKeywords"),
    };

    await Blog.create(newBlog);

    // CRITICAL: Next.js aggressively caches pages.
    // This tells Next.js to clear the cache so your new blog shows up instantly!
    revalidatePath("/admin");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/");

    return { success: true, message: "Blog created successfully!" };
  } catch (error) {
    console.error("Failed to create blog:", error);
    return { success: false, message: error.message };
  }
}

// 3. DELETE: Remove a blog by its ID
export async function deleteBlog(id) {
  await dbConnect();

  try {
    await Blog.findByIdAndDelete(id);

    // Clear the cache again so the deleted item vanishes instantly
    revalidatePath("/admin");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return { success: false, message: "Failed to delete blog" };
  }
}

// --- BLOG UPDATE LOGIC ---
export async function getBlogById(id) {
  await dbConnect();
  try {
    const blog = await Blog.findById(id).lean();
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    return null;
  }
}

export async function updateBlog(id, formData) {
  await dbConnect();
  try {
    const updatedData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      date: formData.get("date"),
      summary: formData.get("summary"),
      content: formData.get("content"),
      trending: formData.get("trending") === "on",
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      metaKeywords: formData.get("metaKeywords"),
    };

    await Blog.findByIdAndUpdate(id, updatedData);
    revalidatePath("/admin");
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// --- REVIEWS CRUD LOGIC ---
export async function getAdminReviews() {
  await dbConnect();
  const reviews = await Review.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(reviews));
}

export async function createReview(formData) {
  await dbConnect();
  const newReview = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    summary: formData.get("summary"),
    rating: Number(formData.get("rating")),
    reviewCount: Number(formData.get("reviewCount")),
    price: formData.get("price"),
    content: formData.get("content"),
    trending: formData.get("trending") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaKeywords: formData.get("metaKeywords"),
  };
  await Review.create(newReview);
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/");
}

export async function deleteReview(id) {
  await dbConnect();
  await Review.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/");
}

// --- COMPARISONS CRUD LOGIC ---
export async function getAdminComparisons() {
  await dbConnect();
  const comparisons = await Comparison.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(comparisons));
}

export async function createComparison(formData) {
  await dbConnect();
  const newComparison = {
    tool1: formData.get("tool1"),
    tool2: formData.get("tool2"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    summary: formData.get("summary"),
    winner: formData.get("winner"),
    // Storing the table as a parsed JSON string from a textarea for simplicity
    table: JSON.parse(formData.get("table")),
    content: formData.get("content"),
    trending: formData.get("trending") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaKeywords: formData.get("metaKeywords"),
  };
  await Comparison.create(newComparison);
  revalidatePath("/admin");
  revalidatePath("/comparisons");
  revalidatePath(`/comparisons/${slug}`);
  revalidatePath("/");
}

export async function deleteComparison(id) {
  await dbConnect();
  await Comparison.findByIdAndDelete(id);
  revalidatePath("/admin");
  revalidatePath("/comparisons");
  revalidatePath(`/comparisons/${slug}`);
  revalidatePath("/");
}

// --- REVIEWS EDIT LOGIC ---
export async function getReviewById(id) {
  await dbConnect();
  try {
    const review = await Review.findById(id).lean();
    return JSON.parse(JSON.stringify(review));
  } catch (error) {
    return null;
  }
}

export async function updateReview(id, formData) {
  await dbConnect();
  const updatedData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    summary: formData.get("summary"),
    rating: Number(formData.get("rating")),
    reviewCount: Number(formData.get("reviewCount")),
    price: formData.get("price"),
    content: formData.get("content"),
    trending: formData.get("trending") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaKeywords: formData.get("metaKeywords"),
  };
  await Review.findByIdAndUpdate(id, updatedData);
  revalidatePath("/admin");
  revalidatePath("/reviews");
  revalidatePath(`/reviews/${slug}`);
  revalidatePath("/");
  return { success: true };
}

// --- COMPARISONS EDIT LOGIC ---
export async function getComparisonById(id) {
  await dbConnect();
  try {
    const comparison = await Comparison.findById(id).lean();
    return JSON.parse(JSON.stringify(comparison));
  } catch (error) {
    return null;
  }
}

export async function updateComparison(id, formData) {
  await dbConnect();
  const updatedData = {
    tool1: formData.get("tool1"),
    tool2: formData.get("tool2"),
    slug: formData.get("slug"),
    date: formData.get("date"),
    summary: formData.get("summary"),
    winner: formData.get("winner"),
    table: JSON.parse(formData.get("table")),
    content: formData.get("content"),
    trending: formData.get("trending") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaKeywords: formData.get("metaKeywords"),
  };
  await Comparison.findByIdAndUpdate(id, updatedData);
  revalidatePath("/admin");
  revalidatePath("/comparisons");
  revalidatePath(`/comparisons/${slug}`);
  revalidatePath("/");
  return { success: true };
}
