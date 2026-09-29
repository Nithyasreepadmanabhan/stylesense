import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { WardrobeItem } from '../../types/wardrobe';
import { Outfit } from '../../types/outfit';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Sparkles, 
  Plus, 
  Wand2, 
  Shirt, 
  Camera, 
  Layers, 
  Sun, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';

interface UserDashboardProps {
  onNavigate: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const w = await dataService.getWardrobe(currentUser.id);
    const o = await dataService.getOutfits(currentUser.id);
    setWardrobe(w);
    setOutfits(o);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Editorial Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Personal Stylist Active
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              Bonjour, <span className="italic text-[#D4AF37]">{currentUser.fullName}</span>
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Curate your aesthetic today. You have <strong className="text-white">{wardrobe.length} items</strong> cataloged in your digital wardrobe ready for smart pairing.
            </p>
          </div>

          {/* Today's Context Widget */}
          <div className="bg-[#0B0B0D]/80 border border-[#26262E] p-5 rounded-2xl backdrop-blur-md min-w-[280px]">
            <div className="flex items-center justify-between border-b border-[#26262E] pb-3 mb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Sun className="w-4 h-4" />
                <span className="text-xs font-bold text-white">Summer • 28°C Sunny</span>
              </div>
              <Badge variant="gold">TODAY</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Upcoming: <strong>Interview at 3 PM</strong></span>
              </div>
              <p className="text-[11px] text-gray-400 italic">
                Recommendation: Crisp White Linen Shirt + Navy Blazer + Leather Oxfords.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-8 pt-8 border-t border-[#26262E]/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Button variant="gold" size="sm" onClick={() => onNavigate('wardrobe')} className="w-full">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('style-ai')} className="w-full">
            <Wand2 className="w-4 h-4 text-[#D4AF37]" /> Style My Wardrobe
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('natural-language')} className="w-full">
            <Shirt className="w-4 h-4" /> "I Only Have..."
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('visual-search')} className="w-full">
            <Camera className="w-4 h-4" /> Upload Inspiration
          </Button>
          <Button variant="dark" size="sm" onClick={() => onNavigate('outfits')} className="w-full">
            <Layers className="w-4 h-4" /> Create Outfit
          </Button>
        </div>
      </div>

      {/* Grid Section: Recent Wardrobe & Outfit Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Wardrobe Spotlight & Recommended Outfits */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Wardrobe Spotlight */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Digital Wardrobe Highlights</h3>
                <p className="text-xs text-gray-400">Recently cataloged pieces from your collection</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('wardrobe')}>
                View All ({wardrobe.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {wardrobe.slice(0, 4).map(item => (
                <Card key={item.id} className="p-3 group cursor-pointer" onClick={() => onNavigate('wardrobe')}>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-[#16161A] mb-3">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white">
                      {item.color}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-gray-400">{item.category} • {item.style}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Curated Outfit Looks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-white">Curated Style Outfits</h3>
                <p className="text-xs text-gray-400">AI combinatorial recommendations scored for your aesthetic</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('outfits')}>
                View Outfits <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {outfits.slice(0, 2).map(outfit => (
                <Card key={outfit.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="gold">Score: {outfit.score || 95}%</Badge>
                      <span className="text-xs text-gray-400">{outfit.occasion}</span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-white">{outfit.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{outfit.description}</p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#26262E]">
                    <div className="flex -space-x-2">
                      {outfit.items.map((item, idx) => (
                        <img key={idx} src={item.wardrobeItem.imageUrl} alt="Item" className="w-8 h-8 rounded-full border-2 border-[#121215] object-cover" />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray-400 ml-auto">{outfit.items.length} Pieces</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Style DNA Summary & Trending Styles */}
        <div className="space-y-6">
          
          <Card className="p-6 bg-gradient-to-b from-[#16161A] to-[#121215]">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-lg font-bold text-white">Your Style DNA</h4>
              <Badge variant="sage">Minimalist</Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Minimal Aesthetic</span>
                  <span className="text-[#D4AF37] font-bold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-[#26262E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Casual Smart</span>
                  <span className="text-amber-400 font-bold">85%</span>
                </div>
                <div className="h-1.5 w-full bg-[#26262E] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Streetwear</span>
                  <span className="text-emerald-400 font-bold">64%</span>
                </div>
                <div className="h-1.5 w-full bg-[#26262E] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => onNavigate('style-dna')} className="w-full">
              Explore Full Style DNA
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-[#D4AF37]">
              <TrendingUp className="w-5 h-5" />
              <h4 className="font-serif text-base font-bold text-white">Trending Aesthetic</h4>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              Quiet Luxury & Monochromatic Linen combinations are trending up 45% this week across Parisian digital fashion runways.
            </p>

            <Button variant="dark" size="sm" onClick={() => onNavigate('marketplace')} className="w-full">
              Explore Marketplace Collections
            </Button>
          </Card>

        </div>

      </div>

    </div>
  );
};
