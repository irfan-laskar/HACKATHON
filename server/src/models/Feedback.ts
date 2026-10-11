import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  restaurantName?: string;
  businessType: string;
  category: 'feature_request' | 'tool_suggestion' | 'bug_report' | 'user_experience' | 'content_idea' | 'general';
  rating: number; // 1 to 5
  title: string;
  message: string;
  tags: string[];
  status: 'new' | 'reviewed' | 'planned' | 'completed' | 'archived';
  upvotes: number;
  upvotedBy: string[];
  adminResponse?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})*$/,
        'Please enter a valid email address',
      ],
      required: false,
    },
    restaurantName: {
      type: String,
      trim: true,
      maxlength: [120, 'Restaurant name cannot exceed 120 characters'],
      default: '',
    },
    businessType: {
      type: String,
      enum: [
        'Cloud Kitchen',
        'Cafe / Bistro',
        'Fine Dine',
        'Casual Dine-in',
        'Bakery / Dessert',
        'QSR / Street Food',
        'Dhaba / Regional Eatery',
        'Aspiring Food Entrepreneur',
        'Other',
      ],
      default: 'Casual Dine-in',
    },
    category: {
      type: String,
      enum: [
        'feature_request',
        'tool_suggestion',
        'bug_report',
        'user_experience',
        'content_idea',
        'general',
      ],
      default: 'general',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5'],
      default: 5,
    },
    title: {
      type: String,
      required: [true, 'Feedback title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Feedback message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'planned', 'completed', 'archived'],
      default: 'new',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [String],
      default: [],
    },
    adminResponse: {
      type: String,
      default: '',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ category: 1, status: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
