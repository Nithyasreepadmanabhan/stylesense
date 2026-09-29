import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { WardrobeItem } from '../types/wardrobe';
import { Outfit } from '../types/outfit';
import { DigitalDesign, DesignerProfile, FabricMaterial, Pattern, ColorPalette, DesignCollection } from '../types/designer';
import { Product, WishlistItem } from '../types/product';
import { UserProfile, UserStyleDna } from '../types/user';
import { ModerationReport, PlatformAnalytics } from '../types/admin';
import { 
  MOCK_USERS, 
  MOCK_STYLE_DNA, 
  MOCK_DESIGNERS, 
  MOCK_WARDROBE_ITEMS, 
  MOCK_OUTFITS, 
  MOCK_DESIGNS, 
  MOCK_FABRICS, 
  MOCK_PATTERNS, 
  MOCK_PALETTES, 
  MOCK_COLLECTIONS, 
  MOCK_PRODUCTS, 
  MOCK_WISHLIST, 
  MOCK_REPORTS, 
  MOCK_ANALYTICS 
} from './mockData';

// In-memory reactive state containers for seamless out-of-the-box local editing
let localWardrobe: WardrobeItem[] = [...MOCK_WARDROBE_ITEMS];
let localOutfits: Outfit[] = [...MOCK_OUTFITS];
let localDesigns: DigitalDesign[] = [...MOCK_DESIGNS];
let localFabrics: FabricMaterial[] = [...MOCK_FABRICS];
let localPatterns: Pattern[] = [...MOCK_PATTERNS];
let localPalettes: ColorPalette[] = [...MOCK_PALETTES];
let localCollections: DesignCollection[] = [...MOCK_COLLECTIONS];
let localWishlist: WishlistItem[] = [...MOCK_WISHLIST];
let localReports: ModerationReport[] = [...MOCK_REPORTS];
let localDesigners: DesignerProfile[] = [...MOCK_DESIGNERS];

export const dataService = {
  // Check connection status
  isOnline: () => isSupabaseConfigured,

  // ==========================================
  // WARDROBE OPERATIONS
  // ==========================================
  async getWardrobe(userId?: string): Promise<WardrobeItem[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('wardrobe_items').select('*');
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) return data as WardrobeItem[];
      } catch (err) {
        console.warn('Supabase fetch error, using local fallback:', err);
      }
    }
    return localWardrobe;
  },

  async addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'createdAt'>): Promise<WardrobeItem> {
    const newItem: WardrobeItem = {
      ...item,
      id: `w-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('wardrobe_items').insert([newItem]).select().single();
        if (!error && data) return data as WardrobeItem;
      } catch (err) {
        console.warn('Supabase insert error, falling back to local state:', err);
      }
    }

    localWardrobe = [newItem, ...localWardrobe];
    return newItem;
  },

  async updateWardrobeItem(id: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('wardrobe_items').update(updates).eq('id', id).select().single();
        if (!error && data) return data as WardrobeItem;
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }

    localWardrobe = localWardrobe.map(item => item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item);
    return localWardrobe.find(i => i.id === id)!;
  },

  async deleteWardrobeItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('wardrobe_items').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }
    localWardrobe = localWardrobe.filter(item => item.id !== id);
    return true;
  },

  // ==========================================
  // OUTFITS OPERATIONS
  // ==========================================
  async getOutfits(userId?: string): Promise<Outfit[]> {
    return localOutfits;
  },

  async saveOutfit(outfit: Omit<Outfit, 'id' | 'createdAt'>): Promise<Outfit> {
    const newOutfit: Outfit = {
      ...outfit,
      id: `out-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localOutfits = [newOutfit, ...localOutfits];
    return newOutfit;
  },

  async deleteOutfit(id: string): Promise<boolean> {
    localOutfits = localOutfits.filter(o => o.id !== id);
    return true;
  },

  // ==========================================
  // DESIGNER & DESIGNS OPERATIONS
  // ==========================================
  async getDesigners(): Promise<DesignerProfile[]> {
    return localDesigners;
  },

  async getDesigns(designerId?: string): Promise<DigitalDesign[]> {
    if (designerId) {
      return localDesigns.filter(d => d.designerId === designerId);
    }
    return localDesigns;
  },

  async saveDigitalDesign(design: Omit<DigitalDesign, 'id' | 'createdAt'>): Promise<DigitalDesign> {
    const newDesign: DigitalDesign = {
      ...design,
      id: `desg-${Date.now()}`,
      likesCount: 0,
      savesCount: 0,
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };
    localDesigns = [newDesign, ...localDesigns];
    return newDesign;
  },

  async updateDesignStatus(id: string, status: DigitalDesign['status']): Promise<DigitalDesign> {
    localDesigns = localDesigns.map(d => d.id === id ? { ...d, status, isPublic: status === 'published' } : d);
    return localDesigns.find(d => d.id === id)!;
  },

  async getFabrics(designerId?: string): Promise<FabricMaterial[]> {
    return localFabrics;
  },

  async addFabric(fabric: Omit<FabricMaterial, 'id' | 'createdAt'>): Promise<FabricMaterial> {
    const newFab: FabricMaterial = {
      ...fabric,
      id: `fab-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localFabrics = [newFab, ...localFabrics];
    return newFab;
  },

  async getPatterns(designerId?: string): Promise<Pattern[]> {
    return localPatterns;
  },

  async addPattern(pattern: Omit<Pattern, 'id' | 'createdAt'>): Promise<Pattern> {
    const newPat: Pattern = {
      ...pattern,
      id: `pat-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localPatterns = [newPat, ...localPatterns];
    return newPat;
  },

  async getColorPalettes(): Promise<ColorPalette[]> {
    return localPalettes;
  },

  async addColorPalette(palette: Omit<ColorPalette, 'id' | 'createdAt'>): Promise<ColorPalette> {
    const newPal: ColorPalette = {
      ...palette,
      id: `pal-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localPalettes = [newPal, ...localPalettes];
    return newPal;
  },

  async getCollections(): Promise<DesignCollection[]> {
    return localCollections;
  },

  // ==========================================
  // MARKETPLACE PRODUCTS & WISHLIST
  // ==========================================
  async getProducts(): Promise<Product[]> {
    return MOCK_PRODUCTS;
  },

  async getWishlist(userId: string): Promise<WishlistItem[]> {
    return localWishlist;
  },

  async toggleWishlist(userId: string, itemType: WishlistItem['itemType'], itemId: string, itemData?: any): Promise<boolean> {
    const exists = localWishlist.some(w => w.itemId === itemId && w.itemType === itemType);
    if (exists) {
      localWishlist = localWishlist.filter(w => !(w.itemId === itemId && w.itemType === itemType));
      return false; // Removed
    } else {
      const newItem: WishlistItem = {
        id: `wsh-${Date.now()}`,
        userId,
        itemType,
        itemId,
        itemData,
        createdAt: new Date().toISOString()
      };
      localWishlist = [newItem, ...localWishlist];
      return true; // Added
    }
  },

  // ==========================================
  // ADMIN & MODERATION
  // ==========================================
  async getAnalytics(): Promise<PlatformAnalytics> {
    return MOCK_ANALYTICS;
  },

  async getReports(): Promise<ModerationReport[]> {
    return localReports;
  },

  async resolveReport(reportId: string, status: ModerationReport['status'], adminResponse?: string): Promise<boolean> {
    localReports = localReports.map(r => r.id === reportId ? { ...r, status, adminResponse, resolvedAt: new Date().toISOString() } : r);
    return true;
  },

  async verifyDesigner(designerId: string, status: DesignerProfile['verificationStatus']): Promise<boolean> {
    localDesigners = localDesigners.map(d => d.id === designerId ? { ...d, verificationStatus: status } : d);
    return true;
  },

  // User Profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    return MOCK_USERS.find(u => u.id === userId || u.userId === userId) || MOCK_USERS[0];
  },

  async getUserStyleDna(): Promise<UserStyleDna> {
    return MOCK_STYLE_DNA;
  }
};
