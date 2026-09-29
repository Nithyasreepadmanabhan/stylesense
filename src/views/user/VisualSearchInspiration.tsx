import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { analyzeVisualInspirationImage } from '../../services/aiEngine';
import { WardrobeItem } from '../../types/wardrobe';
import { OutfitRecommendationResult } from '../../types/outfit';
import { Product } from '../../types/product';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ImageUploader } from '../../components/widgets/ImageUploader';
import { Camera, Sparkles, ShoppingBag, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface VisualSearchInspirationProps {
  onNavigate: (view: string) => void;
}

export const VisualSearchInspiration: React.FC<VisualSearchInspirationProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();

  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'
  );
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!imageUrl) return;
    const wardrobe = await dataService.getWardrobe(currentUser.id);
    const result = analyzeVisualInspirationImage(imageUrl, wardrobe);
    setAnalysisResult(result);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase">
            <Camera className="w-3.5 h-3.5" /> Visual Search & Inspiration Matcher
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">Visual Outfit Inspiration</h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Upload an inspiration photo from Pinterest, Instagram, or a fashion editorial. StyleSense analyzes garment cuts, colors, and styles to recreate the look using your digital wardrobe.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Upload Inspiration Photo */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-white mb-4">1. Inspiration Image</h3>
            <ImageUploader
              value={imageUrl}
              onChange={url => setImageUrl(url)}
              label="Upload Inspiration Outfit Photo"
            />
            
            <Button 
              variant="gold" 
              onClick={handleAnalyze} 
              className="w-full mt-4 py-3" 
              disabled={!imageUrl}
            >
              <Sparkles className="w-4 h-4" /> Analyze & Recreate Look
            </Button>
          </Card>
        </div>

        {/* Right 7 Cols: Analysis Breakdown & Recreated Outfits */}
        <div className="lg:col-span-7 space-y-6">
          {analysisResult ? (
            <div className="space-y-6">
              
              {/* Vision Recognition Breakdown Card */}
              <Card className="p-6 border-[#D4AF37]/40 bg-gradient-to-b from-[#16161A] to-[#121215]">
                <h3 className="font-serif text-xl font-bold text-white mb-3">Vision Recognition Analysis</h3>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262E] text-center">
                    <span className="text-[10px] text-gray-400 block uppercase">Aesthetic</span>
                    <span className="text-xs font-bold text-white">{analysisResult.detectedStyle}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262E] text-center">
                    <span className="text-[10px] text-gray-400 block uppercase">Occasion</span>
                    <span className="text-xs font-bold text-white">{analysisResult.detectedOccasion}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B0B0D] border border-[#26262E] text-center">
                    <span className="text-[10px] text-gray-400 block uppercase">Primary Colors</span>
                    <span className="text-xs font-bold text-[#D4AF37]">{analysisResult.detectedColors.join(', ')}</span>
                  </div>
                </div>
              </Card>

              {/* Recreate With My Wardrobe */}
              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">Recreate With My Wardrobe</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysisResult.recreatedOutfits.map((rec: OutfitRecommendationResult) => (
                    <Card key={rec.id} className="p-5">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="gold">Match: {rec.score}%</Badge>
                        <span className="text-xs text-emerald-400 font-semibold">{rec.colorMatchRating}</span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-white">{rec.outfit.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{rec.whyItWorks}</p>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <Card className="p-12 text-center my-auto">
              <Camera className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-white">Ready for Analysis</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Click "Analyze & Recreate Look" to trigger visual similarity matching against your wardrobe.
              </p>
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};
