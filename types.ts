
export type Category = 
  | 'Writing & Content'
  | 'Image & Design'
  | 'Video & Audio'
  | 'Chatbots & AI Assistants'
  | 'Business, SEO & Productivity'
  | 'Developer / Advanced Tools'
  | 'Specialized / Miscellaneous';

export interface AITool {
  id: string;
  name: string;
  url: string;
  category: Category;
  description: string;
  isFeatured: boolean;
  isHot: boolean;
  isVerified: boolean;
  isSponsored: boolean;
  trustScore: number;
  rating: number; // 0-5
  clicks: number;
  createdAt: string;
  logo?: string;
}

export interface AdSlot {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  type: 'banner' | 'sidebar';
}

export type SortOption = 'Popularity' | 'Newest' | 'Name' | 'Highest Rated';

export interface Analytics {
  totalClicks: number;
  trendingTools: string[];
  categoryDistribution: Record<string, number>;
}
