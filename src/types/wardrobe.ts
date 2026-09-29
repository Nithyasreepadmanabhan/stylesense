export type ClothingCategory = 'Top' | 'Bottom' | 'Dress' | 'Jacket' | 'Shoes' | 'Accessories' | 'Bag';

export type WardrobeSubcategory = 
  // Tops
  | 'T-Shirt' | 'Shirt' | 'Blouse' | 'Kurti' | 'Top' | 'Sweater' | 'Hoodie'
  // Bottoms
  | 'Jeans' | 'Trousers' | 'Skirt' | 'Shorts' | 'Cargo Pants' | 'Leggings'
  // Outerwear & One-piece
  | 'Dress' | 'Saree' | 'Blazer' | 'Coat' | 'Jacket' | 'Sherwani'
  // Footwear
  | 'Sneakers' | 'Heels' | 'Flats' | 'Boots' | 'Sandals' | 'Loafers' | 'Formal Shoes'
  // Accessories & Bags
  | 'Watch' | 'Belt' | 'Bag' | 'Sunglasses' | 'Jewellery' | 'Cap' | 'Scarf' | 'Wallet';

export type ColorTone = 
  | 'White' | 'Black' | 'Blue' | 'Beige' | 'Brown' 
  | 'Green' | 'Red' | 'Pink' | 'Yellow' | 'Purple' | 'Grey' | 'Silver' | 'Gold' | 'Navy' | 'Olive';

export type PatternType = 'Solid' | 'Striped' | 'Plaid' | 'Floral' | 'Graphic' | 'Geometric' | 'Polka Dot' | 'Animal Print' | 'Traditional';

export type SeasonType = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Hot' | 'Cold' | 'Rainy' | 'All Season';

export type OccasionType = 
  | 'College' | 'Office' | 'Interview' | 'Date' | 'Birthday' 
  | 'Party' | 'Wedding' | 'Reception' | 'Dinner' | 'Travel' 
  | 'Beach' | 'Gym' | 'Festival' | 'Casual' | 'Formal' | 'Traditional';

export type StyleType = 
  | 'Casual' | 'Minimal' | 'Streetwear' | 'Formal' | 'Smart Casual' 
  | 'Vintage' | 'Traditional' | 'Party' | 'Sporty' | 'Luxury' | 'Bohemian' | 'Y2K' | 'Korean';

export interface WardrobeItem {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory;
  subcategory: WardrobeSubcategory;
  brand?: string;
  color: ColorTone;
  secondaryColor?: ColorTone;
  material?: string;
  pattern: PatternType;
  style: StyleType;
  season: SeasonType;
  occasion: OccasionType;
  size?: string;
  purchasePrice?: number;
  purchaseDate?: string;
  imageUrl: string;
  notes?: string;
  isFavorite: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt?: string;
}
