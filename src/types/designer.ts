export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type DesignStatus = 'draft' | 'submitted' | 'published' | 'rejected';

export interface DesignerProfile {
  id: string;
  userId: string;
  brandName: string;
  bio: string;
  logoUrl?: string;
  coverUrl?: string;
  verificationStatus: VerificationStatus;
  websiteUrl?: string;
  instagramHandle?: string;
  followerCount?: number;
  designsCount?: number;
  collectionsCount?: number;
  createdAt: string;
}

export interface FabricMaterial {
  id: string;
  designerId: string;
  name: string;
  category: 'Cotton' | 'Silk' | 'Linen' | 'Denim' | 'Wool' | 'Polyester' | 'Velvet' | 'Satin' | 'Chiffon' | 'Leather' | 'Custom';
  description: string;
  imageUrl: string;
  textureUrl?: string;
  color: string;
  weight: string; // e.g. "180 gsm"
  stretch: 'Low' | 'Medium' | 'High' | 'None';
  transparency: 'Opaque' | 'Semi-Sheer' | 'Sheer';
  finish: 'Matte' | 'Glossy' | 'Textured' | 'Satin';
  season?: string;
  recommendedUsage?: string;
  createdAt: string;
}

export interface Pattern {
  id: string;
  designerId: string;
  name: string;
  description: string;
  category: 'Floral' | 'Geometric' | 'Abstract' | 'Stripes' | 'Checks' | 'Polka Dots' | 'Animal Print' | 'Traditional' | 'Custom';
  previewUrl: string;
  patternData?: Record<string, any>;
  tags: string[];
  createdAt: string;
}

export interface ColorPalette {
  id: string;
  designerId: string;
  name: string;
  description?: string;
  colors: string[]; // HEX values e.g. ["#0B0B0D", "#D4AF37", "#E07A5F"]
  createdAt: string;
}

export interface DesignCollection {
  id: string;
  designerId: string;
  name: string;
  description: string;
  coverImageUrl: string;
  season: 'Spring/Summer' | 'Autumn/Winter' | 'Resort' | 'Couture';
  year: number;
  theme: string;
  status: 'draft' | 'published' | 'archived';
  designIds?: string[];
  createdAt: string;
}

export interface CanvasElement {
  id: string;
  type: 'shape' | 'component' | 'line' | 'text' | 'pattern' | 'garment_base';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  textureUrl?: string;
  componentType?: 'collar' | 'sleeve' | 'pocket' | 'button' | 'zipper' | 'embroidery' | 'bodice' | 'skirt' | 'pant';
  rotation?: number;
}

export interface DigitalDesign {
  id: string;
  designerId: string;
  designerName?: string;
  collectionId?: string;
  collectionName?: string;
  name: string;
  description: string;
  previewImageUrl: string;
  designJson: {
    canvas: { width: number; height: number; backgroundColor: string };
    elements: CanvasElement[];
    fabricId?: string;
    patternId?: string;
    paletteId?: string;
  };
  status: DesignStatus;
  isPublic: boolean;
  likesCount: number;
  savesCount: number;
  viewsCount: number;
  createdAt: string;
}
