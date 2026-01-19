export interface MediaPost {
  id: string;
  userId: string;
  caption?: string;
  imageUrl: string;
  location?: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  type: "IMAGE" | "VIDEO";
  travelPlanId?: string;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  travelPlan?: {
    id: string;
    destination: string;
    startDate?: string;
    endDate?: string;
  };
  uploadSessionId?: string;
}

export interface Comment {
  id: string;
  userId: string;
  mediaPostId: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    profileImage?: string;
  };
  replies?: Comment[];
}

export interface Photo extends MediaPost {
  photographer: string;
  photographerAvatar: string;
  aspectRatio: "portrait" | "landscape" | "square";
  timestamp: string;
  date: string;
  tripName: string;
  uploadSessionId?: string;
}

export interface UserPhotoGroup {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  photos: Photo[];
  totalLikes: number;
  totalComments: number;
  latestPhotoTime: string;
}

export interface PhotoComment extends Comment {
  author: string;
  authorAvatar: string;
  timestamp: string;
  likes: number;
}

export type FilterType = "All" | "Beach" | "City" | "Mountain" | "Forest";
