import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { UserStyleDna } from '../../types/user';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Sparkles, Sliders, Palette, Tag, Check } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const StyleDnaProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [styleDna, setStyleDna] = useState<UserStyleDna | null>(null);

  useEffect(() => {
    loadDna();
  }, []);

  const loadDna = async () => {
    const data = await dataService.getUserStyleDna();
    setStyleDna(data);
  };

  if (!styleDna) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Profile Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-24 h-24 rounded-full border-2 border-[#D4AF37] object-cover shadow-luxe-gold" />
          <div className="space-y-2 text-center md:text-left">
            <h1 className="font-serif text-3xl font-bold text-white">{currentUser.fullName}</h1>
            <p className="text-gray-400 text-xs">{currentUser.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="gold">Archetype: Minimalist</Badge>
              <Badge variant="dark">Preferred Fit: {styleDna.preferredFit}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Style Breakdown Percentages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <Card className="p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Visual Style Breakdown
          </h3>
          
          <div className="space-y-4">
            {Object.entries(styleDna.styleBreakdownPercentages).map(([styleName, pct]) => (
              <div key={styleName}>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-white">{styleName}</span>
                  <span className="text-[#D4AF37]">{pct}%</span>
                </div>
                <div className="h-2 w-full bg-[#16161A] border border-[#26262E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Favorite Attributes Card */}
        <Card className="p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Favorite Colors Palette</h4>
            <div className="flex flex-wrap gap-2">
              {styleDna.favoriteColors.map(col => (
                <span key={col} className="px-3 py-1 rounded-full bg-[#16161A] border border-[#26262E] text-xs font-semibold text-white">
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Preferred Fashion Brands</h4>
            <div className="flex flex-wrap gap-2">
              {styleDna.preferredBrands.map(b => (
                <span key={b} className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-semibold">
                  {b}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Shopping Budget Range</h4>
            <p className="text-sm font-bold text-white">
              {formatCurrency(styleDna.preferredPriceRange.min)} – {formatCurrency(styleDna.preferredPriceRange.max)}
            </p>
          </div>
        </Card>

      </div>

    </div>
  );
};
