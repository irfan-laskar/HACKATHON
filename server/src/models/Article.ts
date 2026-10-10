import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory?: string;
  tags: string[];
  coverImage: string;
  author: mongoose.Types.ObjectId;
  readTime: number; // in minutes
  status: 'draft' | 'published' | 'archived';
  guideSection: 'marketing_hub' | 'startup_academy' | 'branding_photography' | 'legal_gst' | 'influencer_collab' | 'blog';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  checklists: { item: string }[];
  tools: { name: string; url?: string; description?: string }[];
  faq: { question: string; answer: string }[];
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
  commonMistakes?: string[];
  officialLinks?: { title: string; url: string; isGovernmentPortal: boolean }[];
  lastVerifiedDate?: Date;
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: {
      type: String,
      required: [true, 'Please provide an article title'],
      trim: true,
      maxlength: [180, 'Title cannot exceed 180 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short excerpt/summary'],
      maxlength: [350, 'Excerpt cannot exceed 350 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide article content'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readTime: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    guideSection: {
      type: String,
      enum: ['marketing_hub', 'startup_academy', 'branding_photography', 'legal_gst', 'influencer_collab', 'blog'],
      default: 'marketing_hub',
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    checklists: [
      {
        item: { type: String, required: true },
      },
    ],
    tools: [
      {
        name: { type: String, required: true },
        url: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    prosAndCons: {
      pros: [{ type: String }],
      cons: [{ type: String }],
    },
    commonMistakes: [{ type: String }],
    officialLinks: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        isGovernmentPortal: { type: Boolean, default: false },
      },
    ],
    lastVerifiedDate: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ArticleSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

export default mongoose.model<IArticle>('Article', ArticleSchema);
