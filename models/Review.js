// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  summary: { type: String, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  price: { type: String, required: true },
  content: { type: String, required: true },
  trending: { type: Boolean, default: false },
  metaTitle: { type: String, required: false },
  metaDescription: { type: String, required: false },
  metaKeywords: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);