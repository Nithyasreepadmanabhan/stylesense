import { WardrobeItem } from '../types/wardrobe';
import { Outfit } from '../types/outfit';
import { DigitalDesign, DesignerProfile, FabricMaterial, Pattern, ColorPalette, DesignCollection } from '../types/designer';
import { Product, WishlistItem } from '../types/product';
import { UserProfile, UserStyleDna } from '../types/user';
import { ModerationReport, PlatformAnalytics } from '../types/admin';

// ==========================================
// 1. DEMO USERS & PROFILES
// ==========================================
export const MOCK_USERS: UserProfile[] = [
  { id: 'usr-1', userId: 'auth-1', fullName: 'Sophia Bennett', username: 'sophiab', email: 'sophia@example.com', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', bio: 'Minimalist fashion enthusiast & fashion tech researcher.', createdAt: '2026-01-15' },
  { id: 'usr-2', userId: 'auth-2', fullName: 'Elena Rostova', username: 'elena_designer', email: 'elena@maisonderostova.com', role: 'designer', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', bio: 'Lead Couture Designer at Maison Rostova.', createdAt: '2026-01-20' },
  { id: 'usr-3', userId: 'auth-3', fullName: 'Alexander Vance', username: 'alexvance_admin', email: 'admin@stylesense.com', role: 'admin', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', bio: 'StyleSense Chief Platform Moderator & Director.', createdAt: '2026-01-01' },
  { id: 'usr-4', userId: 'auth-4', fullName: 'Marcus Chen', username: 'marcus_c', email: 'marcus@example.com', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', bio: 'Streetwear collector & sneaker lover.', createdAt: '2026-02-01' },
  { id: 'usr-5', userId: 'auth-5', fullName: 'Aria Montgomery', username: 'aria_studio', email: 'aria@ariastudios.com', role: 'designer', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', bio: 'Sustainable textiles & bespoke minimalist tailoring.', createdAt: '2026-02-10' },
  { id: 'usr-6', userId: 'auth-6', fullName: 'Devon Miller', username: 'devonm', email: 'devon@example.com', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400', bio: 'Corporate style & formal wear connoisseur.', createdAt: '2026-02-15' },
  { id: 'usr-7', userId: 'auth-7', fullName: 'Priya Sharma', username: 'priyasharma_designer', email: 'priya@heritage.in', role: 'designer', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', bio: 'Fusion ethnic & traditional silk jacquard designer.', createdAt: '2026-02-20' },
  { id: 'usr-8', userId: 'auth-8', fullName: 'Liam O\'Connor', username: 'liamo', email: 'liam@example.com', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400', bio: 'Casual Smart aesthetics enthusiast.', createdAt: '2026-03-01' },
  { id: 'usr-9', userId: 'auth-9', fullName: 'Kaito Tanaka', username: 'kaito_y2k', email: 'kaito@tokyothreads.jp', role: 'designer', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', bio: 'Tokyo avant-garde & Y2K digital fashion pioneer.', createdAt: '2026-03-05' },
  { id: 'usr-10', userId: 'auth-10', fullName: 'Camila Rodriguez', username: 'camila_r', email: 'camila@example.com', role: 'user', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', bio: 'Resort wear & Bohemian style curator.', createdAt: '2026-03-10' }
];

export const MOCK_STYLE_DNA: UserStyleDna = {
  favoriteColors: ['White', 'Black', 'Beige', 'Navy', 'Olive'],
  preferredStyles: ['Minimal', 'Casual', 'Smart Casual', 'Streetwear'],
  preferredOccasions: ['College', 'Casual', 'Office', 'Dinner'],
  preferredBrands: ['Acne Studios', 'COS', 'Everlane', 'Uniqlo', 'Maison Rostova'],
  preferredPriceRange: { min: 50, max: 800 },
  preferredFit: 'Oversized & Structured',
  styleBreakdownPercentages: {
    'Minimal': 92,
    'Casual': 85,
    'Smart Casual': 78,
    'Streetwear': 64,
    'Formal': 45,
    'Vintage': 30
  }
};

// ==========================================
// 2. DEMO DESIGNERS
// ==========================================
export const MOCK_DESIGNERS: DesignerProfile[] = [
  { id: 'des-1', userId: 'usr-2', brandName: 'Maison Rostova', bio: 'Parisian luxury couture featuring silk draping & modern architectural silhouettes.', logoUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200', coverUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', verificationStatus: 'approved', followerCount: 14200, designsCount: 18, collectionsCount: 4, createdAt: '2026-01-20' },
  { id: 'des-2', userId: 'usr-5', brandName: 'Aria Studio', bio: 'Bespoke organic linen tailoring & zero-waste sustainable outerwear.', logoUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200', coverUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200', verificationStatus: 'approved', followerCount: 8900, designsCount: 12, collectionsCount: 3, createdAt: '2026-02-10' },
  { id: 'des-3', userId: 'usr-7', brandName: 'Heritage Weaves', bio: 'Reimagining royal Indian handlooms & zardozi embroidery for global red carpets.', logoUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200', coverUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200', verificationStatus: 'approved', followerCount: 11400, designsCount: 15, collectionsCount: 3, createdAt: '2026-02-20' },
  { id: 'des-4', userId: 'usr-9', brandName: 'Kaito Avant-Garde', bio: 'Cyber-futuristic digital garments & iridescent technical outerwear.', logoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', coverUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200', verificationStatus: 'approved', followerCount: 6300, designsCount: 9, collectionsCount: 2, createdAt: '2026-03-05' },
  { id: 'des-5', userId: 'usr-4', brandName: 'Urban Edge Lab', bio: 'Underground Japanese selvedge denim & heavyweight streetwear garments.', logoUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200', coverUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200', verificationStatus: 'pending', followerCount: 2100, designsCount: 5, collectionsCount: 1, createdAt: '2026-03-12' }
];

// ==========================================
// 3. DEMO WARDROBE ITEMS (50+ Items)
// ==========================================
export const MOCK_WARDROBE_ITEMS: WardrobeItem[] = [
  // Tops (15)
  { id: 'w-1', userId: 'usr-1', name: 'White Oversized Linen Shirt', category: 'Top', subcategory: 'Shirt', brand: 'COS', color: 'White', pattern: 'Solid', style: 'Minimal', season: 'Summer', occasion: 'Casual', size: 'M', purchasePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600', isFavorite: true, createdAt: '2026-01-10' },
  { id: 'w-2', userId: 'usr-1', name: 'Heavyweight Black Crewneck Tee', category: 'Top', subcategory: 'T-Shirt', brand: 'Uniqlo U', color: 'Black', pattern: 'Solid', style: 'Minimal', season: 'All Season', occasion: 'College', size: 'M', purchasePrice: 35, imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600', isFavorite: true, createdAt: '2026-01-12' },
  { id: 'w-3', userId: 'usr-1', name: 'Oatmeal Ribbed Knit Sweater', category: 'Top', subcategory: 'Sweater', brand: 'Acne Studios', color: 'Beige', pattern: 'Solid', style: 'Casual', season: 'Winter', occasion: 'Casual', size: 'M', purchasePrice: 240, imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600', isFavorite: false, createdAt: '2026-01-15' },
  { id: 'w-4', userId: 'usr-1', name: 'Navy Tailored Double-Breasted Blazer', category: 'Jacket', subcategory: 'Blazer', brand: 'Theory', color: 'Navy', pattern: 'Solid', style: 'Formal', season: 'All Season', occasion: 'Interview', size: '38R', purchasePrice: 420, imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', isFavorite: true, createdAt: '2026-01-18' },
  { id: 'w-5', userId: 'usr-1', name: 'Striped Blue Poplin Cotton Shirt', category: 'Top', subcategory: 'Shirt', brand: 'Ralph Lauren', color: 'Blue', secondaryColor: 'White', pattern: 'Striped', style: 'Smart Casual', season: 'Spring', occasion: 'Office', size: 'M', purchasePrice: 140, imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', isFavorite: false, createdAt: '2026-01-20' },
  { id: 'w-6', userId: 'usr-1', name: 'Olive Drab Utility Overshirt', category: 'Jacket', subcategory: 'Jacket', brand: 'Carhartt WIP', color: 'Olive', pattern: 'Solid', style: 'Streetwear', season: 'Autumn', occasion: 'Casual', size: 'L', purchasePrice: 130, imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600', isFavorite: false, createdAt: '2026-01-22' },
  { id: 'w-7', userId: 'usr-1', name: 'Silk Ivory Camisole Top', category: 'Top', subcategory: 'Top', brand: 'Equipment', color: 'White', pattern: 'Solid', style: 'Luxury', season: 'Summer', occasion: 'Date', size: 'S', purchasePrice: 180, imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', isFavorite: true, createdAt: '2026-01-25' },
  { id: 'w-8', userId: 'usr-1', name: 'Charcoal Grey Cashmere Turtleneck', category: 'Top', subcategory: 'Sweater', brand: 'Everlane', color: 'Grey', pattern: 'Solid', style: 'Minimal', season: 'Winter', occasion: 'Dinner', size: 'M', purchasePrice: 195, imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600', isFavorite: false, createdAt: '2026-01-28' },
  { id: 'w-9', userId: 'usr-1', name: 'Crimson Silk Chanderi Kurti', category: 'Top', subcategory: 'Kurti', brand: 'FabIndia', color: 'Red', pattern: 'Traditional', style: 'Traditional', season: 'Summer', occasion: 'Festival', size: 'M', purchasePrice: 90, imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', isFavorite: true, createdAt: '2026-02-02' },
  { id: 'w-10', userId: 'usr-1', name: 'Graphic Vintage Rock Tee', category: 'Top', subcategory: 'T-Shirt', brand: 'Thrifted', color: 'Black', pattern: 'Graphic', style: 'Vintage', season: 'Summer', occasion: 'Casual', size: 'L', purchasePrice: 40, imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600', isFavorite: false, createdAt: '2026-02-05' },

  // Bottoms (12)
  { id: 'w-11', userId: 'usr-1', name: 'Light Wash Straight Leg Jeans', category: 'Bottom', subcategory: 'Jeans', brand: "Levi's 501", color: 'Blue', pattern: 'Solid', style: 'Casual', season: 'All Season', occasion: 'College', size: '30W', purchasePrice: 98, imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', isFavorite: true, createdAt: '2026-01-11' },
  { id: 'w-12', userId: 'usr-1', name: 'Black Tailored Pleated Trousers', category: 'Bottom', subcategory: 'Trousers', brand: 'COS', color: 'Black', pattern: 'Solid', style: 'Formal', season: 'All Season', occasion: 'Interview', size: '30W', purchasePrice: 140, imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600', isFavorite: true, createdAt: '2026-01-14' },
  { id: 'w-13', userId: 'usr-1', name: 'Sand Beige Relaxed Chino Pants', category: 'Bottom', subcategory: 'Trousers', brand: 'Dockers', color: 'Beige', pattern: 'Solid', style: 'Smart Casual', season: 'Spring', occasion: 'Office', size: '30W', purchasePrice: 75, imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', isFavorite: false, createdAt: '2026-01-19' },
  { id: 'w-14', userId: 'usr-1', name: 'Raw Indigo Selvedge Denim', category: 'Bottom', subcategory: 'Jeans', brand: 'APC', color: 'Navy', pattern: 'Solid', style: 'Streetwear', season: 'Autumn', occasion: 'Casual', size: '30W', purchasePrice: 220, imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600', isFavorite: true, createdAt: '2026-01-21' },
  { id: 'w-15', userId: 'usr-1', name: 'Olive Green Modular Cargo Pants', category: 'Bottom', subcategory: 'Cargo Pants', brand: 'Nike ACG', color: 'Olive', pattern: 'Solid', style: 'Streetwear', season: 'All Season', occasion: 'Travel', size: 'M', purchasePrice: 160, imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600', isFavorite: false, createdAt: '2026-01-24' },
  { id: 'w-16', userId: 'usr-1', name: 'Cream Wool A-Line Midi Skirt', category: 'Bottom', subcategory: 'Skirt', brand: 'Zara', color: 'White', pattern: 'Solid', style: 'Minimal', season: 'Spring', occasion: 'Date', size: 'S', purchasePrice: 85, imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', isFavorite: false, createdAt: '2026-01-29' },

  // Footwear (10)
  { id: 'w-17', userId: 'usr-1', name: 'White Leather Common Projects Sneakers', category: 'Shoes', subcategory: 'Sneakers', brand: 'Common Projects', color: 'White', pattern: 'Solid', style: 'Minimal', season: 'All Season', occasion: 'Casual', size: '42', purchasePrice: 410, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', isFavorite: true, createdAt: '2026-01-13' },
  { id: 'w-18', userId: 'usr-1', name: 'Black Leather Oxford Dress Shoes', category: 'Shoes', subcategory: 'Formal Shoes', brand: 'Loake', color: 'Black', pattern: 'Solid', style: 'Formal', season: 'All Season', occasion: 'Formal', size: '42', purchasePrice: 290, imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', isFavorite: false, createdAt: '2026-01-16' },
  { id: 'w-19', userId: 'usr-1', name: 'Tan Suede Chelsea Boots', category: 'Shoes', subcategory: 'Boots', brand: 'RM Williams', color: 'Brown', pattern: 'Solid', style: 'Smart Casual', season: 'Autumn', occasion: 'Dinner', size: '42', purchasePrice: 495, imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600', isFavorite: true, createdAt: '2026-01-23' },
  { id: 'w-20', userId: 'usr-1', name: 'Retro New Balance 550 Sneakers', category: 'Shoes', subcategory: 'Sneakers', brand: 'New Balance', color: 'White', secondaryColor: 'Green', pattern: 'Solid', style: 'Streetwear', season: 'All Season', occasion: 'College', size: '42', purchasePrice: 120, imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', isFavorite: false, createdAt: '2026-01-27' },
  { id: 'w-21', userId: 'usr-1', name: 'Burgundy Penny Loafers', category: 'Shoes', subcategory: 'Loafers', brand: 'G.H. Bass', color: 'Brown', pattern: 'Solid', style: 'Vintage', season: 'All Season', occasion: 'Office', size: '42', purchasePrice: 175, imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', isFavorite: true, createdAt: '2026-02-01' },

  // Outerwear & Dresses (8)
  { id: 'w-22', userId: 'usr-1', name: 'Classic Indigo Denim Jacket', category: 'Jacket', subcategory: 'Jacket', brand: "Levi's", color: 'Blue', pattern: 'Solid', style: 'Casual', season: 'Spring', occasion: 'Casual', size: 'M', purchasePrice: 110, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', isFavorite: true, createdAt: '2026-01-17' },
  { id: 'w-23', userId: 'usr-1', name: 'Black Silk Slip Evening Dress', category: 'Dress', subcategory: 'Dress', brand: 'Reformation', color: 'Black', pattern: 'Solid', style: 'Luxury', season: 'Summer', occasion: 'Party', size: 'M', purchasePrice: 280, imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', isFavorite: true, createdAt: '2026-02-03' },
  { id: 'w-24', userId: 'usr-1', name: 'Beige Double-Breasted Trench Coat', category: 'Jacket', subcategory: 'Coat', brand: 'Burberry', color: 'Beige', pattern: 'Solid', style: 'Formal', season: 'Autumn', occasion: 'Travel', size: 'M', purchasePrice: 1200, imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600', isFavorite: true, createdAt: '2026-02-08' },
  { id: 'w-25', userId: 'usr-1', name: 'Royal Blue Kanjeevaram Silk Saree', category: 'Dress', subcategory: 'Saree', brand: 'Heritage Weaves', color: 'Blue', secondaryColor: 'Gold', pattern: 'Traditional', style: 'Traditional', season: 'All Season', occasion: 'Wedding', size: 'Free', purchasePrice: 650, imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', isFavorite: true, createdAt: '2026-02-14' },

  // Accessories & Bags (8)
  { id: 'w-26', userId: 'usr-1', name: 'Minimalist Stainless Steel Watch', category: 'Accessories', subcategory: 'Watch', brand: 'Junghans', color: 'Silver', pattern: 'Solid', style: 'Minimal', season: 'All Season', occasion: 'Office', size: '38mm', purchasePrice: 850, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', isFavorite: true, createdAt: '2026-01-09' },
  { id: 'w-27', userId: 'usr-1', name: 'Cognac Leather Crossbody Shoulder Bag', category: 'Bag', subcategory: 'Bag', brand: 'Polène', color: 'Brown', pattern: 'Solid', style: 'Luxury', season: 'All Season', occasion: 'Casual', size: 'Medium', purchasePrice: 460, imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', isFavorite: true, createdAt: '2026-01-26' },
  { id: 'w-28', userId: 'usr-1', name: 'Black Full-Grain Leather Belt', category: 'Accessories', subcategory: 'Belt', brand: 'Tanner Goods', color: 'Black', pattern: 'Solid', style: 'Formal', season: 'All Season', occasion: 'Interview', size: '32', purchasePrice: 95, imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600', isFavorite: false, createdAt: '2026-01-30' },
  { id: 'w-29', userId: 'usr-1', name: 'Classic Tortoiseshell Wayfarer Sunglasses', category: 'Accessories', subcategory: 'Sunglasses', brand: 'Ray-Ban', color: 'Brown', pattern: 'Solid', style: 'Casual', season: 'Summer', occasion: 'Beach', size: 'Standard', purchasePrice: 165, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', isFavorite: true, createdAt: '2026-02-06' }
];

// Add extra wardrobe items dynamically to exceed 50 items for complete dataset
for (let i = 30; i <= 55; i++) {
  const cats: Array<[any, any]> = [
    ['Top', 'T-Shirt'], ['Top', 'Shirt'], ['Bottom', 'Trousers'], 
    ['Shoes', 'Sneakers'], ['Accessories', 'Jewellery'], ['Bag', 'Bag']
  ];
  const selectedCat = cats[i % cats.length];
  const colors: Array<any> = ['White', 'Black', 'Blue', 'Beige', 'Grey', 'Olive', 'Navy'];
  const col = colors[i % colors.length];

  MOCK_WARDROBE_ITEMS.push({
    id: `w-${i}`,
    userId: 'usr-1',
    name: `${col} Essential Fashion Piece #${i}`,
    category: selectedCat[0],
    subcategory: selectedCat[1],
    brand: i % 2 === 0 ? 'COS' : 'Zara',
    color: col,
    pattern: 'Solid',
    style: 'Casual',
    season: 'All Season',
    occasion: 'Casual',
    imageUrl: MOCK_WARDROBE_ITEMS[(i - 1) % 25].imageUrl,
    isFavorite: i % 4 === 0,
    createdAt: `2026-02-${(i % 25) + 1}`
  });
}

// ==========================================
// 4. DEMO OUTFITS (30+ Outfits)
// ==========================================
export const MOCK_OUTFITS: Outfit[] = [
  {
    id: 'out-1',
    userId: 'usr-1',
    name: 'Clean Casual Minimalist',
    description: 'Crisp white linen shirt paired with light jeans and clean leather sneakers.',
    occasion: 'College',
    style: 'Minimal',
    season: 'Summer',
    colorPalette: ['#FFFFFF', '#A4C3D2', '#1C1C1C'],
    coverImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    isPublic: true,
    isFavorite: true,
    score: 96,
    whyItWorks: 'The neutral white linen top relaxes the straight silhouette of the light jeans, anchored by low-profile white leather sneakers.',
    items: [
      { id: 'oi-1', wardrobeItem: MOCK_WARDROBE_ITEMS[0] },
      { id: 'oi-2', wardrobeItem: MOCK_WARDROBE_ITEMS[10] },
      { id: 'oi-3', wardrobeItem: MOCK_WARDROBE_ITEMS[16] },
      { id: 'oi-4', wardrobeItem: MOCK_WARDROBE_ITEMS[25] }
    ],
    createdAt: '2026-02-10'
  },
  {
    id: 'out-2',
    userId: 'usr-1',
    name: 'Executive Boardroom Formal',
    description: 'Double-breasted navy blazer with black tailored trousers and oxford shoes.',
    occasion: 'Interview',
    style: 'Formal',
    season: 'All Season',
    colorPalette: ['#1B263B', '#000000', '#FFFFFF'],
    coverImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
    isPublic: true,
    isFavorite: true,
    score: 98,
    whyItWorks: 'Navy and black tailored combination creates high authority and visual contrast for executive meetings.',
    items: [
      { id: 'oi-5', wardrobeItem: MOCK_WARDROBE_ITEMS[3] },
      { id: 'oi-6', wardrobeItem: MOCK_WARDROBE_ITEMS[11] },
      { id: 'oi-7', wardrobeItem: MOCK_WARDROBE_ITEMS[17] },
      { id: 'oi-8', wardrobeItem: MOCK_WARDROBE_ITEMS[27] }
    ],
    createdAt: '2026-02-12'
  },
  {
    id: 'out-3',
    userId: 'usr-1',
    name: 'Gallery Opening & Evening Drinks',
    description: 'Black silk slip dress layered under a classic camel beige trench coat.',
    occasion: 'Date',
    style: 'Luxury',
    season: 'Autumn',
    colorPalette: ['#1C1C1C', '#D4B996', '#C5A059'],
    coverImageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
    isPublic: true,
    isFavorite: true,
    score: 95,
    whyItWorks: 'Satin gloss against structured beige trench fabric presents elevated Parisian evening elegance.',
    items: [
      { id: 'oi-9', wardrobeItem: MOCK_WARDROBE_ITEMS[22] },
      { id: 'oi-10', wardrobeItem: MOCK_WARDROBE_ITEMS[23] },
      { id: 'oi-11', wardrobeItem: MOCK_WARDROBE_ITEMS[18] },
      { id: 'oi-12', wardrobeItem: MOCK_WARDROBE_ITEMS[26] }
    ],
    createdAt: '2026-02-15'
  }
];

// Seed extra outfits dynamically to reach 30+ items
for (let i = 4; i <= 32; i++) {
  MOCK_OUTFITS.push({
    id: `out-${i}`,
    userId: 'usr-1',
    name: `Curated Look #${i} — ${i % 2 === 0 ? 'Smart Casual' : 'Streetwear Style'}`,
    description: `A harmonious balance of ${i % 2 === 0 ? 'earthy neutral tones' : 'monochrome contrast'} perfect for daily wear.`,
    occasion: i % 3 === 0 ? 'Office' : i % 2 === 0 ? 'Casual' : 'Dinner',
    style: i % 2 === 0 ? 'Smart Casual' : 'Streetwear',
    season: 'All Season',
    colorPalette: ['#1A1A1E', '#F4EFEA', '#8B9D83'],
    coverImageUrl: MOCK_OUTFITS[(i - 1) % 3].coverImageUrl,
    isPublic: true,
    isFavorite: i % 3 === 0,
    score: 90 + (i % 8),
    whyItWorks: 'Color tone match and proportional layering create a cohesive aesthetic.',
    items: [
      { id: `oi-${i}-1`, wardrobeItem: MOCK_WARDROBE_ITEMS[i % 10] },
      { id: `oi-${i}-2`, wardrobeItem: MOCK_WARDROBE_ITEMS[10 + (i % 6)] },
      { id: `oi-${i}-3`, wardrobeItem: MOCK_WARDROBE_ITEMS[16 + (i % 5)] }
    ],
    createdAt: `2026-02-${(i % 28) + 1}`
  });
}

// ==========================================
// 5. DEMO DIGITAL DESIGNS (20+ Designs)
// ==========================================
export const MOCK_DESIGNS: DigitalDesign[] = [
  {
    id: 'desg-1',
    designerId: 'des-1',
    designerName: 'Maison Rostova',
    collectionId: 'col-1',
    collectionName: 'Summer Couture 2027',
    name: 'Architectural Silk Draped Corset Gown',
    description: 'Sculptural corsetry with asymmetric silk organza drape folds.',
    previewImageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600',
    status: 'published',
    isPublic: true,
    likesCount: 1240,
    savesCount: 580,
    viewsCount: 4200,
    designJson: {
      canvas: { width: 1200, height: 1600, backgroundColor: '#0F0F11' },
      elements: [
        { id: 'el-1', type: 'component', name: 'Bodice Structure', x: 400, y: 300, width: 400, height: 550, fill: '#16161A', componentType: 'bodice' },
        { id: 'el-2', type: 'component', name: 'Asymmetric Silk Sleeve Draping', x: 320, y: 320, width: 250, height: 400, fill: '#D4AF37', componentType: 'sleeve' },
        { id: 'el-3', type: 'shape', name: 'Pleated Skirt Train', x: 380, y: 820, width: 440, height: 600, fill: '#0F0F11' }
      ]
    },
    createdAt: '2026-02-01'
  },
  {
    id: 'desg-2',
    designerId: 'des-2',
    designerName: 'Aria Studio',
    collectionId: 'col-2',
    collectionName: 'Organic Earth Textiles',
    name: 'Bespoke Linen Oversized Trench Jacket',
    description: 'Zero-waste unbleached organic linen outerwear with storm flaps.',
    previewImageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600',
    status: 'published',
    isPublic: true,
    likesCount: 890,
    savesCount: 410,
    viewsCount: 2900,
    designJson: {
      canvas: { width: 1200, height: 1600, backgroundColor: '#FAF9F6' },
      elements: [
        { id: 'el-4', type: 'component', name: 'Trench Lapel Collar', x: 420, y: 250, width: 360, height: 200, fill: '#EFE8DF', componentType: 'collar' },
        { id: 'el-5', type: 'component', name: 'Utility Flap Pockets', x: 450, y: 600, width: 140, height: 160, fill: '#D4B996', componentType: 'pocket' }
      ]
    },
    createdAt: '2026-02-14'
  },
  {
    id: 'desg-3',
    designerId: 'des-3',
    designerName: 'Heritage Weaves',
    name: 'Royal Zardozi Silk Sherwani Jacket',
    description: 'Hand-embroidered gold bullion thread work on raw mulberry silk.',
    previewImageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
    status: 'submitted', // Pending admin approval
    isPublic: false,
    likesCount: 450,
    savesCount: 190,
    viewsCount: 1100,
    designJson: {
      canvas: { width: 1200, height: 1600, backgroundColor: '#1A0B0B' },
      elements: [
        { id: 'el-6', type: 'component', name: 'Embroidery Crest', x: 500, y: 400, width: 200, height: 250, fill: '#FFD700', componentType: 'embroidery' }
      ]
    },
    createdAt: '2026-03-01'
  }
];

// Seed extra designs to reach 20+
for (let i = 4; i <= 22; i++) {
  MOCK_DESIGNS.push({
    id: `desg-${i}`,
    designerId: i % 2 === 0 ? 'des-1' : 'des-4',
    designerName: i % 2 === 0 ? 'Maison Rostova' : 'Kaito Avant-Garde',
    name: `Digital Fashion Concept #${i}`,
    description: `Experimental 3D digital garment pattern composition explore #${i}.`,
    previewImageUrl: MOCK_DESIGNS[(i - 1) % 3].previewImageUrl,
    status: i % 3 === 0 ? 'submitted' : 'published',
    isPublic: i % 3 !== 0,
    likesCount: 300 + (i * 45),
    savesCount: 120 + (i * 15),
    viewsCount: 1500 + (i * 200),
    designJson: {
      canvas: { width: 1200, height: 1600, backgroundColor: '#0B0B0D' },
      elements: [
        { id: `el-${i}-1`, type: 'component', name: 'Garment Piece', x: 400, y: 300, width: 400, height: 500, fill: '#D4AF37', componentType: 'bodice' }
      ]
    },
    createdAt: `2026-03-${(i % 25) + 1}`
  });
}

// ==========================================
// 6. DEMO FABRICS, PATTERNS & PALETTES (20+ Fabrics, 15+ Patterns)
// ==========================================
export const MOCK_FABRICS: FabricMaterial[] = [
  { id: 'fab-1', designerId: 'des-1', name: 'Mulberry Silk Satin', category: 'Silk', description: 'Ultra-smooth lustrous drape with high sheen finish.', imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600', color: 'Ivory', weight: '90 gsm', stretch: 'None', transparency: 'Opaque', finish: 'Glossy', recommendedUsage: 'Evening dresses & blouses', createdAt: '2026-01-10' },
  { id: 'fab-2', designerId: 'des-2', name: 'Organic Belgian Unbleached Linen', category: 'Linen', description: 'Heavyweight crisp breathable texture.', imageUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600', color: 'Beige', weight: '240 gsm', stretch: 'None', transparency: 'Opaque', finish: 'Matte', recommendedUsage: 'Tailored trousers & overshirts', createdAt: '2026-01-15' },
  { id: 'fab-3', designerId: 'des-5', name: '14oz Kurabo Japanese Selvedge Denim', category: 'Denim', description: 'Unwashed raw indigo warp denim.', imageUrl: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600', color: 'Indigo Navy', weight: '420 gsm', stretch: 'Low', transparency: 'Opaque', finish: 'Textured', recommendedUsage: 'Structured jackets & jeans', createdAt: '2026-02-01' }
];

for (let i = 4; i <= 22; i++) {
  MOCK_FABRICS.push({
    id: `fab-${i}`,
    designerId: 'des-1',
    name: `Premium Material Tech Spec #${i}`,
    category: i % 2 === 0 ? 'Cotton' : 'Velvet',
    description: `High performance eco-certified material weave #${i}.`,
    imageUrl: MOCK_FABRICS[(i - 1) % 3].imageUrl,
    color: i % 2 === 0 ? 'Charcoal' : 'Champagne Gold',
    weight: `${150 + (i * 10)} gsm`,
    stretch: 'Medium',
    transparency: 'Opaque',
    finish: 'Textured',
    createdAt: '2026-02-10'
  });
}

export const MOCK_PATTERNS: Pattern[] = [
  { id: 'pat-1', designerId: 'des-1', name: 'Art Deco Geometric Gold Lattice', category: 'Geometric', description: 'Intricate 1920s gold filigree line pattern.', previewUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600', tags: ['luxury', 'gold', 'deco'], createdAt: '2026-01-12' },
  { id: 'pat-2', designerId: 'des-3', name: 'Royal Paisley Floral Jacquard', category: 'Traditional', description: 'Classic Mughal floral motif print.', previewUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', tags: ['traditional', 'embroidery'], createdAt: '2026-01-22' }
];

for (let i = 3; i <= 16; i++) {
  MOCK_PATTERNS.push({
    id: `pat-${i}`,
    designerId: 'des-2',
    name: `Digital Texture Motif #${i}`,
    category: i % 2 === 0 ? 'Stripes' : 'Abstract',
    description: `Seamless repeating vector pattern #${i}.`,
    previewUrl: MOCK_PATTERNS[(i - 1) % 2].previewUrl,
    tags: ['modern', 'minimal'],
    createdAt: '2026-02-05'
  });
}

export const MOCK_PALETTES: ColorPalette[] = [
  { id: 'pal-1', designerId: 'des-1', name: 'Monochrome Luxe', description: 'High-contrast editorial obsidian and gold tones.', colors: ['#0B0B0D', '#1C1C21', '#D4AF37', '#FBF9F5'], createdAt: '2026-01-05' },
  { id: 'pal-2', designerId: 'des-2', name: 'Sahara Earth Warmth', description: 'Terracotta, sage olive, and warm linen canvas.', colors: ['#E07A5F', '#8B9D83', '#F4EFEA', '#7A8B73'], createdAt: '2026-01-18' }
];

export const MOCK_COLLECTIONS: DesignCollection[] = [
  { id: 'col-1', designerId: 'des-1', name: 'Summer Couture 2027', description: 'Sculptural evening silhouettes with fluid silk drapes.', coverImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200', season: 'Spring/Summer', year: 2027, theme: 'Parisian Architectural Elegance', status: 'published', createdAt: '2026-01-10' },
  { id: 'col-2', designerId: 'des-2', name: 'Organic Earth Textiles', description: 'Sustainable raw linen & unbleached wool capsule.', coverImageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200', season: 'Resort', year: 2026, theme: 'Zero-Waste Minimalism', status: 'published', createdAt: '2026-02-01' }
];

// ==========================================
// 7. DEMO MARKETPLACE PRODUCTS (40+ Products)
// ==========================================
export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', designerId: 'des-1', designerName: 'Maison Rostova', name: 'Architectural Silk Draped Blazer', description: 'Hand-tailored silk blazer with structured shoulders.', category: 'Jacket', subcategory: 'Blazer', brand: 'Maison Rostova', price: 850, currency: 'USD', imageUrls: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], colors: ['Black', 'Champagne Gold'], sizes: ['S', 'M', 'L'], material: 'Silk Satin', style: 'Luxury', occasion: 'Formal', stockStatus: 'in_stock', rating: 4.9, reviewsCount: 38, createdAt: '2026-01-15' },
  { id: 'prod-2', designerId: 'des-2', designerName: 'Aria Studio', name: 'Organic Unbleached Linen Trousers', description: 'High-waisted wide leg relaxed linen trousers.', category: 'Bottom', subcategory: 'Trousers', brand: 'Aria Studio', price: 290, currency: 'USD', imageUrls: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600'], colors: ['Beige', 'White'], sizes: ['XS', 'S', 'M', 'L'], material: 'Organic Linen', style: 'Minimal', occasion: 'Casual', stockStatus: 'in_stock', rating: 4.8, reviewsCount: 24, createdAt: '2026-02-01' },
  { id: 'prod-3', designerId: 'des-3', designerName: 'Heritage Weaves', name: 'Hand-Embroidered Zardozi Silk Clutch Bag', description: 'Raw silk bag with gold thread embroidery.', category: 'Bag', subcategory: 'Bag', brand: 'Heritage Weaves', price: 340, currency: 'USD', imageUrls: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'], colors: ['Gold', 'Blue'], sizes: ['One Size'], material: 'Raw Silk', style: 'Traditional', occasion: 'Wedding', stockStatus: 'in_stock', rating: 5.0, reviewsCount: 19, createdAt: '2026-02-15' }
];

for (let i = 4; i <= 42; i++) {
  MOCK_PRODUCTS.push({
    id: `prod-${i}`,
    designerId: i % 2 === 0 ? 'des-1' : 'des-2',
    designerName: i % 2 === 0 ? 'Maison Rostova' : 'Aria Studio',
    name: `Luxe Designer Apparel Item #${i}`,
    description: `Crafted with premium sustainable materials #${i}.`,
    category: i % 3 === 0 ? 'Top' : i % 2 === 0 ? 'Shoes' : 'Accessories',
    subcategory: i % 3 === 0 ? 'Shirt' : 'Sneakers',
    brand: i % 2 === 0 ? 'Maison Rostova' : 'Aria Studio',
    price: 120 + (i * 25),
    currency: 'USD',
    imageUrls: [MOCK_PRODUCTS[(i - 1) % 3].imageUrls[0]],
    colors: ['White', 'Black', 'Gold'],
    sizes: ['S', 'M', 'L'],
    material: 'Premium Cotton / Silk',
    style: 'Luxury',
    occasion: 'Casual',
    stockStatus: 'in_stock',
    rating: 4.7,
    reviewsCount: 15 + i,
    createdAt: `2026-02-${(i % 25) + 1}`
  });
}

// ==========================================
// 8. DEMO WISHLIST & REPORTS & ANALYTICS
// ==========================================
export const MOCK_WISHLIST: WishlistItem[] = [
  { id: 'wsh-1', userId: 'usr-1', itemType: 'product', itemId: 'prod-1', itemData: MOCK_PRODUCTS[0], createdAt: '2026-02-10' },
  { id: 'wsh-2', userId: 'usr-1', itemType: 'design', itemId: 'desg-1', itemData: MOCK_DESIGNS[0], createdAt: '2026-02-12' }
];

export const MOCK_REPORTS: ModerationReport[] = [
  { id: 'rep-1', reporterId: 'usr-1', reporterName: 'Sophia Bennett', targetType: 'product', targetId: 'prod-5', targetTitle: 'Unverified Designer Product', reason: 'Misleading material description', status: 'pending', createdAt: '2026-03-01' },
  { id: 'rep-2', reporterId: 'usr-4', reporterName: 'Marcus Chen', targetType: 'design', targetId: 'desg-10', targetTitle: 'Digital Design #10', reason: 'Copyright infringement query', status: 'reviewing', createdAt: '2026-03-05' }
];

export const MOCK_ANALYTICS: PlatformAnalytics = {
  totalUsers: 14850,
  activeUsers: 8420,
  totalDesigners: 340,
  pendingDesignerApprovals: 4,
  totalDesigns: 1280,
  pendingDesignApprovals: 6,
  totalCollections: 210,
  totalProducts: 3450,
  totalOutfits: 9800,
  totalReports: 12,
  userGrowth: [
    { date: 'Jan 2026', users: 8200, designers: 190 },
    { date: 'Feb 2026', users: 11400, designers: 260 },
    { date: 'Mar 2026', users: 14850, designers: 340 }
  ],
  categoryPopularity: [
    { category: 'Tops & Shirts', count: 4200, percentage: 38 },
    { category: 'Bottoms & Trousers', count: 3100, percentage: 28 },
    { category: 'Footwear', count: 2100, percentage: 19 },
    { category: 'Accessories & Bags', count: 1650, percentage: 15 }
  ],
  stylePopularity: [
    { style: 'Minimalist', count: 4800 },
    { style: 'Casual', count: 4100 },
    { style: 'Streetwear', count: 3200 },
    { style: 'Smart Casual', count: 2900 },
    { style: 'Formal & Couture', count: 1800 }
  ]
};
