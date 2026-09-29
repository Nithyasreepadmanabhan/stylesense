import { WardrobeItem, OccasionType, StyleType, SeasonType } from '../types/wardrobe';
import { Outfit, OutfitRecommendationResult } from '../types/outfit';
import { Product } from '../types/product';
import { MOCK_PRODUCTS } from './mockData';

// Color Harmony pairings
const COLOR_HARMONY_MAP: Record<string, string[]> = {
  'White': ['Black', 'Blue', 'Beige', 'Brown', 'Green', 'Red', 'Pink', 'Grey', 'Navy', 'Olive'],
  'Black': ['White', 'Blue', 'Beige', 'Red', 'Grey', 'Green', 'Yellow', 'Gold', 'Silver'],
  'Blue': ['White', 'Beige', 'Black', 'Brown', 'Grey', 'Silver'],
  'Beige': ['White', 'Blue', 'Black', 'Brown', 'Green', 'Olive', 'Gold'],
  'Brown': ['White', 'Beige', 'Blue', 'Green', 'Olive'],
  'Green': ['White', 'Black', 'Beige', 'Brown', 'Navy'],
  'Red': ['White', 'Black', 'Blue', 'Grey'],
  'Grey': ['White', 'Black', 'Blue', 'Pink', 'Silver'],
  'Navy': ['White', 'Beige', 'Grey', 'Gold', 'Brown'],
  'Olive': ['White', 'Black', 'Beige', 'Brown', 'Navy']
};

/**
 * 1. Style My Wardrobe Algorithmic Engine
 */
export function generateOutfitRecommendations(
  userWardrobe: WardrobeItem[],
  targetOccasion: OccasionType,
  targetStyle: StyleType,
  targetSeason: SeasonType = 'Summer'
): OutfitRecommendationResult[] {
  if (!userWardrobe || userWardrobe.length === 0) return [];

  const tops = userWardrobe.filter(i => i.category === 'Top');
  const bottoms = userWardrobe.filter(i => i.category === 'Bottom');
  const shoes = userWardrobe.filter(i => i.category === 'Shoes');
  const jackets = userWardrobe.filter(i => i.category === 'Jacket');
  const accessories = userWardrobe.filter(i => i.category === 'Accessories' || i.category === 'Bag');

  if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
    // If user's wardrobe lacks a category, generate hybrid recommendation with default placeholders
    return generateFallbackRecommendation(userWardrobe, targetOccasion, targetStyle, targetSeason);
  }

  const results: OutfitRecommendationResult[] = [];

  // Combinatorial scoring logic
  tops.forEach(top => {
    bottoms.forEach(bottom => {
      shoes.forEach(shoe => {
        let score = 70; // Base score

        // Occasion match (+10)
        if (top.occasion === targetOccasion) score += 5;
        if (bottom.occasion === targetOccasion) score += 5;

        // Style match (+10)
        if (top.style === targetStyle) score += 5;
        if (bottom.style === targetStyle) score += 5;

        // Season match (+5)
        if (top.season === targetSeason || top.season === 'All Season') score += 5;

        // Color harmony match (+10)
        const compatible = COLOR_HARMONY_MAP[top.color] || ['White', 'Black', 'Blue', 'Beige'];
        if (compatible.includes(bottom.color) || top.color === bottom.color) {
          score += 10;
        }

        const finalScore = Math.min(99, score);
        const accessory = accessories.length > 0 ? accessories[Math.floor(Math.random() * accessories.length)] : undefined;
        const jacket = jackets.length > 0 && Math.random() > 0.5 ? jackets[Math.floor(Math.random() * jackets.length)] : undefined;

        const outfitItems = [
          { id: `rec-${top.id}`, wardrobeItem: top },
          { id: `rec-${bottom.id}`, wardrobeItem: bottom },
          { id: `rec-${shoe.id}`, wardrobeItem: shoe }
        ];

        if (jacket) outfitItems.push({ id: `rec-${jacket.id}`, wardrobeItem: jacket });
        if (accessory) outfitItems.push({ id: `rec-${accessory.id}`, wardrobeItem: accessory });

        const outfit: Outfit = {
          id: `rec-outfit-${top.id}-${bottom.id}`,
          userId: top.userId,
          name: `${targetStyle} ${targetOccasion} Outfit`,
          description: `Curated combination of ${top.color} ${top.name} with ${bottom.color} ${bottom.name}.`,
          occasion: targetOccasion,
          style: targetStyle,
          season: targetSeason,
          colorPalette: [top.color, bottom.color, shoe.color],
          coverImageUrl: top.imageUrl,
          items: outfitItems,
          isPublic: false,
          isFavorite: false,
          createdAt: new Date().toISOString()
        };

        results.push({
          id: outfit.id,
          outfit,
          score: finalScore,
          colorMatchRating: finalScore > 90 ? 'Perfect Harmony' : 'High Compatibility',
          whyItWorks: `The ${top.color.toLowerCase()} ${top.name.toLowerCase()} pairs with the ${bottom.color.toLowerCase()} ${bottom.name.toLowerCase()} and ${shoe.name.toLowerCase()}. The color tones align perfectly for a ${targetOccasion.toLowerCase()} setting in ${targetSeason.toLowerCase()} weather.`
        });
      });
    });
  });

  // Sort by score descending and return top 6
  return results.sort((a, b) => b.score - a.score).slice(0, 6);
}

function generateFallbackRecommendation(
  userWardrobe: WardrobeItem[],
  targetOccasion: OccasionType,
  targetStyle: StyleType,
  targetSeason: SeasonType
): OutfitRecommendationResult[] {
  const sampleTop = userWardrobe.find(i => i.category === 'Top') || userWardrobe[0];
  const sampleBottom = userWardrobe.find(i => i.category === 'Bottom') || userWardrobe[0];
  const sampleShoes = userWardrobe.find(i => i.category === 'Shoes') || userWardrobe[0];

  const outfit: Outfit = {
    id: `rec-fallback-1`,
    userId: sampleTop ? sampleTop.userId : 'usr-1',
    name: `${targetStyle} ${targetOccasion} Look`,
    description: `Curated style recommendation based on your wardrobe preferences.`,
    occasion: targetOccasion,
    style: targetStyle,
    season: targetSeason,
    colorPalette: ['#FFFFFF', '#1A1A1E', '#D4AF37'],
    coverImageUrl: sampleTop ? sampleTop.imageUrl : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
    items: [
      { id: 'fb-1', wardrobeItem: sampleTop },
      { id: 'fb-2', wardrobeItem: sampleBottom },
      { id: 'fb-3', wardrobeItem: sampleShoes }
    ].filter(i => i.wardrobeItem !== undefined),
    isPublic: false,
    isFavorite: false,
    createdAt: new Date().toISOString()
  };

  return [{
    id: 'rec-fallback-1',
    outfit,
    score: 92,
    colorMatchRating: 'High Harmony',
    whyItWorks: `Balanced neutral color palette optimized for ${targetOccasion} settings.`,
    missingItems: [
      { name: 'Leather Belt', category: 'Accessories', reason: 'Adding a matching belt anchors the top and bottom transition.' },
      { name: 'Minimalist Watch', category: 'Accessories', reason: 'Completes wrist detail for formal/smart casual occasions.' }
    ]
  }];
}

/**
 * 2. "I Only Have..." Natural Language Parser & Missing Items Detector
 */
export function parseNaturalLanguageStyling(
  inputSentence: string,
  userWardrobe: WardrobeItem[]
): {
  matchedItems: WardrobeItem[];
  unmatchedKeywords: string[];
  suggestedOutfits: OutfitRecommendationResult[];
  missingItems: Array<{ name: string; category: string; suggestedProduct?: Product; reason: string }>;
} {
  const query = inputSentence.toLowerCase();
  const matchedItems: WardrobeItem[] = [];
  const keywordsFound: string[] = [];

  // Match items from user wardrobe based on color or name keywords
  userWardrobe.forEach(item => {
    const itemNameLower = item.name.toLowerCase();
    const colorLower = item.color.toLowerCase();
    const subcatLower = item.subcategory.toLowerCase();

    if (query.includes(colorLower) || query.includes(itemNameLower) || query.includes(subcatLower)) {
      if (!matchedItems.some(m => m.id === item.id)) {
        matchedItems.push(item);
        keywordsFound.push(`${item.color} ${item.subcategory}`);
      }
    }
  });

  // If no direct matches found in user wardrobe, grab top 3 items to demonstrate logic
  const activeItems = matchedItems.length > 0 ? matchedItems : userWardrobe.slice(0, 4);

  // Generate outfit combination using matched items
  const recommendations = generateOutfitRecommendations(
    activeItems,
    'Casual',
    'Smart Casual',
    'Summer'
  );

  // Detect missing items to link to Marketplace
  const hasTop = activeItems.some(i => i.category === 'Top');
  const hasBottom = activeItems.some(i => i.category === 'Bottom');
  const hasShoes = activeItems.some(i => i.category === 'Shoes');
  const hasAccessory = activeItems.some(i => i.category === 'Accessories' || i.category === 'Bag');

  const missingItems: Array<{ name: string; category: string; suggestedProduct?: Product; reason: string }> = [];

  if (!hasAccessory) {
    missingItems.push({
      name: 'Minimalist Wristwatch',
      category: 'Accessories',
      suggestedProduct: MOCK_PRODUCTS.find(p => p.category === 'Accessories') || MOCK_PRODUCTS[0],
      reason: 'A clean silver watch elevates basic t-shirts and casual pants.'
    });
  }

  if (!hasShoes) {
    missingItems.push({
      name: 'White Leather Low-Top Sneakers',
      category: 'Shoes',
      suggestedProduct: MOCK_PRODUCTS.find(p => p.category === 'Shoes') || MOCK_PRODUCTS[0],
      reason: 'White leather sneakers provide maximum versatile pairing with any jeans or trousers.'
    });
  }

  return {
    matchedItems: activeItems,
    unmatchedKeywords: ['watch', 'belt'],
    suggestedOutfits: recommendations,
    missingItems
  };
}

/**
 * 3. Visual Search Inspiration Image Matcher
 */
export function analyzeVisualInspirationImage(
  imageUrl: string,
  userWardrobe: WardrobeItem[]
): {
  detectedStyle: StyleType;
  detectedOccasion: OccasionType;
  detectedColors: string[];
  recreatedOutfits: OutfitRecommendationResult[];
  marketplaceMatches: Product[];
} {
  // Mock vision recognition breakdown
  const detectedStyle: StyleType = 'Minimal';
  const detectedOccasion: OccasionType = 'Casual';
  const detectedColors = ['White', 'Blue', 'Brown'];

  // Match closest wardrobe items
  const recreatedOutfits = generateOutfitRecommendations(
    userWardrobe,
    detectedOccasion,
    detectedStyle,
    'Summer'
  );

  const marketplaceMatches = MOCK_PRODUCTS.slice(0, 4);

  return {
    detectedStyle,
    detectedOccasion,
    detectedColors,
    recreatedOutfits,
    marketplaceMatches
  };
}
