export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'admin';
  avatar?: string;
  bio?: string;
  channelName?: string;
  channelBanner?: string;
  website?: string;
  socialLinks?: {
    youtube?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  followersCount: number;
  followingCount?: number;
  isVerified?: boolean;
  isSuspended?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  guideSection: 'marketing' | 'business' | 'branding_photo' | 'legal' | 'influencer';
  topicsCount: number;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  subcategory?: string;
  tags: string[];
  coverImage: string;
  author: User;
  readTime: number;
  status: 'draft' | 'published' | 'archived';
  guideSection: 'marketing_hub' | 'startup_academy' | 'branding_photography' | 'legal_gst' | 'influencer_collab' | 'blog';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  checklists?: { item: string }[];
  tools?: { name: string; url?: string; description?: string }[];
  faq?: { question: string; answer: string }[];
  prosAndCons?: { pros: string[]; cons: string[] };
  commonMistakes?: string[];
  officialLinks?: { title: string; url: string; isGovernmentPortal: boolean }[];
  lastVerifiedDate?: string;
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Video {
  _id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  category: string;
  tags: string[];
  creator: User;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'published' | 'draft' | 'under_review' | 'rejected';
  isFeatured: boolean;
  learningObjectives?: string[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  targetType: 'article' | 'video';
  targetId: string;
  content: string;
  likesCount: number;
  createdAt: string;
}

export interface Report {
  _id: string;
  reporter: User;
  targetType: 'video' | 'article' | 'comment' | 'user';
  targetId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
  embedUrl: string;
  isLiveApi?: boolean;
}

export interface KnowledgeBrief {
  query: string;
  title: string;
  extract: string;
  description?: string;
  thumbnail?: string;
  sourceUrl?: string;
  relatedTopics: string[];
  keyTakeaways: string[];
}

