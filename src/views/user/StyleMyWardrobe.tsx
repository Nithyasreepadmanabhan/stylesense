import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { generateOutfitRecommendations } from '../../services/aiEngine';
import { WardrobeItem, OccasionType, StyleType, SeasonType } from '../../types/wardrobe';
import { OutfitRecommendationResult } from '../../types/outfit';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Wand2, Sparkles, Heart, RefreshCw, CheckCircle2, ShoppingBag } from 'lucide-react';

export const StyleMyWardrobe: React.FC = () => {
  const { currentUser } = useAuth();

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('College');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('Minimal');
  const [selectedSeason, setSelectedSeason] = useState<SeasonType>('Summer');
  const [recommendations, setRecommendations] = useState<OutfitRecommendationResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadWardrobeAndRecommend();
  }, []);

  const loadWardrobeAndRecommend = async () => {
    const data = await dataService.getWardrobe(currentUser.id);
    setWardrobe(data);
    const recs = generateOutfitRecommendations(data, selectedOccasion, selectedStyle, selectedSeason);
    setRecommendations(recs);
  };

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const recs = generateOutfitRecommendations(wardrobe, selectedOccasion, selectedStyle, selectedSeason);
      setRecommendations(recs);
      setIsGenerating(false);
    }, 400);
  };

  const occasions: OccasionType[] = [
    'College', 'Office', 'Interview', 'Date', 'Birthday', 
    'Party', 'Wedding', 'Reception', 'Dinner', 'Travel', 
    'Beach', 'Gym', 'Festival', 'Casual', 'Formal', 'Traditional'
  ];

  const styles: StyleType[] = [
    'Casual', 'Minimal', 'Streetwear', 'Formal', 'Smart Casual', 
    'Vintage', 'Traditional', 'Party', 'Sporty', 'Luxury', 'Bohemian'
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase">
            <Wand2 className="w-3.5 h-3.5" /> AI Outfit Recommendation Scoring Engine
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Style My Wardrobe</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Select your target occasion, aesthetic style, and weather. Our rule-based AI engine analyzes your actual wardrobe items to calculate high-compatibility outfit pairings.
          </p>
        </div>
      </div>

      {/* Control Filters Panel */}
      <Card className="p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Occasion Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              1. What is the Occasion?
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(occ => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedOccasion === occ
                      ? 'bg-[#D4AF37] text-black shadow-luxe-gold font-bold scale-105'
                      : 'bg-[#16161A] text-gray-300 border border-[#26262E] hover:border-gray-500'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Style Aesthetic Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              2. Desired Aesthetic Style?
            </label>
            <div className="flex flex-wrap gap-2">
              {styles.map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStyle(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedStyle === st
                      ? 'bg-[#D4AF37] text-black shadow-luxe-gold font-bold scale-105'
                      : 'bg-[#16161A] text-gray-300 border border-[#26262E] hover:border-gray-500'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Weather / Season Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#26262E]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold uppercase">Weather Season:</span>
              {(['Summer', 'Winter', 'Spring', 'Autumn', 'All Season'] as SeasonType[]).map(sea => (
                <button
                  key={sea}
                  type="button"
                  onClick={() => setSelectedSeason(sea)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedSeason === sea ? 'bg-white/15 text-white border border-white/30' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {sea}
                </button>
              ))}
            </div>

            <Button type="submit" variant="gold" isLoading={isGenerating}>
              <Sparkles className="w-4 h-4" /> Calculate Recommended Outfits
            </Button>
          </div>

        </form>
      </Card>

      {/* Recommended Outfits Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-white">Recommended Combinations ({recommendations.length})</h3>
          <span className="text-xs text-gray-400">Scored for {selectedOccasion} • {selectedStyle}</span>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <Card key={rec.id} className="p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="gold" className="text-xs py-1 px-3">Style Score: {rec.score}%</Badge>
                    <span className="text-xs text-emerald-400 font-semibold">{rec.colorMatchRating}</span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-white mb-2">{rec.outfit.name}</h4>
                  
                  {/* Items Flatlay Grid */}
                  <div className="grid grid-cols-3 gap-2 my-4">
                    {rec.outfit.items.map((item, idx) => (
                      <div key={idx} className="bg-[#16161A] p-2 rounded-xl border border-[#26262E] text-center">
                        <img src={item.wardrobeItem.imageUrl} alt={item.wardrobeItem.name} className="w-full h-20 object-cover rounded-lg mb-1" />
                        <span className="text-[10px] text-gray-400 block truncate">{item.wardrobeItem.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Why It Works Box */}
                  <div className="p-3 rounded-xl bg-[#16161A]/80 border border-[#26262E] text-xs text-gray-300 leading-relaxed mb-4">
                    <strong className="text-[#D4AF37] block mb-1">✨ Why it works:</strong>
                    {rec.whyItWorks}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Heart className="w-4 h-4 text-rose-400" /> Save Outfit to Lookbook
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-400">No matching outfit combinations found. Try adding more tops, bottoms, and shoes to your digital wardrobe.</p>
          </Card>
        )}
      </div>

    </div>
  );
};
