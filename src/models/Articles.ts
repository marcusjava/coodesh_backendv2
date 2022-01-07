import mongoose, { Document, Model } from 'mongoose';

export interface ArticleI {
  _id?: string;
  id?: number;
  featured: boolean;
  title: string;
  url: string;
  imageUrl: string;
  newsSite: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  createdAt?: string;
  launches?: {
    id: string;
    provider: string;
  }[];
  events?: { id: string; provider: string }[];
}

const ArticleSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    newsSite: { type: String, required: true },
    summary: { type: String, required: true },
    publishedAt: { type: String, required: true },
    launches: [{ id: String, provider: String }],
    events: [{ id: String, provider: String }],
  },
  {
    timestamps: true,
  }
);

export const Article = mongoose.model<ArticleI & Document>(
  'Article',
  ArticleSchema
);
