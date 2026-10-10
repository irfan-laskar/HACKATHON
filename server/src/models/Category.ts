import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  guideSection: 'marketing' | 'business' | 'branding_photo' | 'legal' | 'influencer';
  topicsCount: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Please provide category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a category description'],
    },
    icon: {
      type: String,
      default: 'BookOpen',
    },
    color: {
      type: String,
      default: 'blue',
    },
    guideSection: {
      type: String,
      enum: ['marketing', 'business', 'branding_photo', 'legal', 'influencer'],
      default: 'marketing',
    },
    topicsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>('Category', CategorySchema);
