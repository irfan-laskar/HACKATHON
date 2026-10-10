import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  tags: string[];
  creator: mongoose.Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'published' | 'draft' | 'under_review' | 'rejected';
  moderationNotes?: string;
  rejectionReason?: string;
  isFeatured: boolean;
  learningObjectives?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a video title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
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
      required: [true, 'Please provide a video description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Please provide video media URL'],
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    },
    duration: {
      type: String,
      default: '10:00',
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    status: {
      type: String,
      enum: ['published', 'draft', 'under_review', 'rejected'],
      default: 'published',
    },
    moderationNotes: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    learningObjectives: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model<IVideo>('Video', VideoSchema);
