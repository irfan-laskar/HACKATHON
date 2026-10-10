import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'video' | 'article' | 'comment' | 'user';
  targetId: mongoose.Types.ObjectId;
  reason: 'not_educational' | 'spam' | 'misleading' | 'copyright' | 'inappropriate' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  resolutionNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['video', 'article', 'comment', 'user'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['not_educational', 'spam', 'misleading', 'copyright', 'inappropriate', 'other'],
      required: true,
    },
    details: {
      type: String,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'action_taken', 'dismissed'],
      default: 'pending',
    },
    resolutionNotes: {
      type: String,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReport>('Report', ReportSchema);
