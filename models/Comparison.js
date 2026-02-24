// models/Comparison.js
import mongoose from 'mongoose';

const comparisonSchema = new mongoose.Schema({
  tool1: { type: String, required: true },
  tool2: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  summary: { type: String, required: true },
  winner: { type: String, required: true },
  table: [{ // This perfectly mimics the array of objects from your markdown!
    feature: String,
    valA: String,
    valB: String
  }],
  content: { type: String, required: true },
  trending: { type: Boolean, default: false },
  metaTitle: { type: String, required: false },
  metaDescription: { type: String, required: false },
  metaKeywords: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Comparison || mongoose.model('Comparison', comparisonSchema);