// models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  summary: { type: String, required: true },
  content: { type: String, required: true }, // This will hold your raw Markdown
  trending: { type: Boolean, default: false },
  metaTitle: { type: String, required: false },
  metaDescription: { type: String, required: false },
  metaKeywords: { type: String, required: false },
}, { timestamps: true });

// The "mongoose.models.Blog ||" part prevents Next.js from crashing during hot-reloads
export default mongoose.models.Blog || mongoose.model('Blog', blogSchema);