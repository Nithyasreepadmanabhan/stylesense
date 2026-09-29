import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { parseNaturalLanguageStyling } from '../../services/aiEngine';
import { WardrobeItem } from '../../types/wardrobe';
import { OutfitRecommendationResult } from '../../types/outfit';
import { Product } from '../../types/product';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { MessageSquareCode, Sparkles, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NaturalLanguageStylingProps {
  onNavigate: (view: string) => void;
}

export const NaturalLanguageStyling: React.FC<NaturalLanguageStylingProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const [inputText, setInputText] = useState('I only have black jeans, a white t-shirt, brown shoes and a leather watch.');
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [matchedItems, setMatchedItems] = useState<WardrobeItem[]>([]);
  const [suggestedOutfits, setSuggestedOutfits] = useState<OutfitRecommendationResult[]>([]);
  const [missingItems, setMissingItems] = useState<Array<{ name: string; category: string; suggestedProduct?: Product; reason: string }>>([]);

  useEffect(() => {
    loadAndParse(inputText);
  }, []);

  const loadAndParse = async (sentence: string) => {
    const data = await dataService.getWardrobe(currentUser.id);
    setWardrobe(data);

    const result = parseNaturalLanguageStyling(sentence, data);
    setMatchedItems(result.matchedItems);
    setSuggestedOutfits(result.suggestedOutfits);
    setMissingItems(result.missingItems);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      loadAndParse(inputText);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase">
            <MessageSquareCode className="w-3.5 h-3.5" /> Natural Language AI Assistant
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">"I Only Have..." Styling Interface</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Type what clothing items you currently have available in plain text. StyleSense identifies tokens, maps them to your wardrobe, builds outfit looks, and highlights missing items to complete your aesthetic.
          </p>
        </div>
      </div>

      {/* Natural Language Prompt Input */}
      <Card className="p-6">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
            Type Your Statement or Available Items:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder='e.g. "I only have black jeans, a white shirt and sneakers..."'
              className="py-3 text-base"
            />
            <Button type="submit" variant="gold" className="sm:w-auto w-full px-8 py-3 whitespace-nowrap">
              <Sparkles className="w-4 h-4" /> Parse & Style
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Examples:</span>
            {['"Black jeans, white shirt, leather watch"', '"Blue jeans and beige sweater"'].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => { setInputText(ex.replace(/"/g, '')); loadAndParse(ex); }}
                className="text-gray-300 hover:text-[#D4AF37] underline"
              >
                {ex}
              </button>
            ))}
          </div>
        </form>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Matched Items & Outfits */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Matched Wardrobe Items */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-3">Matched Wardrobe Items ({matchedItems.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {matchedItems.map(item => (
                <Card key={item.id} className="p-3 text-center">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                  <Badge variant="gold" className="text-[9px] mb-1">{item.category}</Badge>
                  <h5 className="text-xs font-semibold text-white truncate">{item.name}</h5>
                </Card>
              ))}
            </div>
          </div>

          {/* Generated Outfits */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-3">Generated Outfit Combinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedOutfits.map(rec => (
                <Card key={rec.id} className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="gold">Score: {rec.score}%</Badge>
                    <span className="text-xs text-[#D4AF37] font-semibold">{rec.colorMatchRating}</span>
                  </div>
                  <h4 className="font-serif font-bold text-white text-base">{rec.outfit.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{rec.whyItWorks}</p>
                </Card>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Missing Items Marketplace Suggestions */}
        <div>
          <Card className="p-6 space-y-4 border-[#D4AF37]/40 bg-gradient-to-b from-[#16161A] to-[#121215]">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold text-white">Missing Items Detector</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              You already have the core basics! Adding these missing accessories or footwear will generate additional high-scoring combinations.
            </p>

            <div className="space-y-4 pt-2">
              {missingItems.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0B0B0D] border border-[#26262E] space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold text-white">{item.name}</h5>
                    <Badge variant="terracotta" className="text-[9px]">{item.category}</Badge>
                  </div>
                  <p className="text-[11px] text-gray-400">{item.reason}</p>
                  
                  {item.suggestedProduct && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onNavigate('marketplace')} 
                      className="w-full mt-2 text-xs py-1.5"
                    >
                      Shop Similar (${item.suggestedProduct.price}) <ArrowRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
