

export type View = 'visaoGeral' | 'liderados' | 'cursos' | 'trilhas' | 'eventos' | 'canais' | 'social';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
}

export interface Course {
  id: string;
  thumbnailUrl: string;
  name: string;
  owner: string;
  category: string;
  creationDate: string;
  duration: string;
  enrolled: number;
  finished: number;
  status: 'Publicado' | 'Em Criação';
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  questionType: 'multipleChoice' | 'openText' | 'nps';
  npsScale?: '1-5' | '1-10';
  options: Option[];
}

export interface Content {
  id: string;
  type: 'image' | 'video' | 'podcast' | 'pdf' | 'link' | 'quiz';
  name: string;
  uploadDate: string;
  deliveryDelay: string;
  deliveryPeriod: 'Manhã' | 'Tarde' | 'Noite';
  quizType?: 'evaluation' | 'survey';
  questions?: Question[];
}

export interface Lesson {
  id: string;
  name: string;
  contents: Content[];
}


// Fix: Add missing type definitions for Post, Channel, Comment, and ViewMode.
export type ViewMode = 'list' | 'grid';

export interface Channel {
  id: string;
  name: string;
  category?: string;
  description: string;
  imageUrl: string;
  isSubscribed: boolean;
  isActive?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  parentId?: string;
}

export interface PostEmbed {
  provider:
    | 'youtube'
    | 'vimeo'
    | 'google_docs'
    | 'google_sheets'
    | 'google_slides'
    | 'h5p'
    | 'genially'
    | 'pdf'
    | string;
  embedUrl: string;
}

export interface Post {
  id: string;
  userId: string;
  channelId: string;
  contentType: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
  mediaUrl?: string;
  embed?: PostEmbed;
  rating: number;
  ratingVotes: number;
  userRating?: number;
  likes: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked?: boolean;
  isActive?: boolean;
  comments: Comment[];
}
