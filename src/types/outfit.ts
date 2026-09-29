import { OccasionType, SeasonType, StyleType, WardrobeItem } from './wardrobe';

export interface OutfitItemPosition {
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  zIndex?: number;
}

export interface OutfitCompositionItem {
  id: string;
  wardrobeItem: WardrobeItem;
  position?: OutfitItemPosition;
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  occasion: OccasionType;
  style: StyleType;
  season: SeasonType;
  colorPalette: string[];
  coverImageUrl?: string;
  items: OutfitCompositionItem[];
  isPublic: boolean;
  isFavorite: boolean;
  score?: number;
  whyItWorks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OutfitRecommendationResult {
  id: string;
  outfit: Outfit;
  score: number;
  whyItWorks: string;
  colorMatchRating: string;
  missingItems?: Array<{
    name: string;
    category: string;
    suggestedProductLink?: string;
    reason: string;
  }>;
}
