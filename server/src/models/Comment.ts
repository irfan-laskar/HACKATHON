import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  targetType: 'article' | 'video';
  targetId: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['article', 'video'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please provide comment text'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
