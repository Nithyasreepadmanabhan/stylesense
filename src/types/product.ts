export interface Product {
  id: string;
  sellerId?: string;
  designerId?: string;
  designerName?: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  currency: string;
  imageUrls: string[];
  colors: string[];
  sizes: string[];
  material: string;
  style: string;
  occasion: string;
  stockStatus: 'in_stock' | 'out_of_stock' | 'pre_order';
  productUrl?: string;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  itemType: 'product' | 'design' | 'outfit' | 'designer';
  itemId: string;
  itemData?: Product | any;
  createdAt: string;
}
