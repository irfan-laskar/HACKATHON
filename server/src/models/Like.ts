import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  targetType: 'article' | 'video' | 'comment';
  targetId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['article', 'video', 'comment'],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Prevent duplicate likes from the same user on the same target
LikeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);
