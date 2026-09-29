export type UserRole = 'user' | 'designer' | 'admin';

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface UserStyleDna {
  favoriteColors: string[];
  preferredStyles: string[];
  preferredOccasions: string[];
  preferredBrands: string[];
  preferredPriceRange: { min: number; max: number };
  preferredFit: string;
  styleBreakdownPercentages: Record<string, number>; // e.g. { "Casual": 90, "Minimal": 80, "Streetwear": 65 }
}
