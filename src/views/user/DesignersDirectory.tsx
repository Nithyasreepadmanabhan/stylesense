import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { DesignerProfile } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Palette, CheckCircle2, UserPlus, Grid } from 'lucide-react';

export const DesignersDirectory: React.FC = () => {
  const [designers, setDesigners] = useState<DesignerProfile[]>([]);

  useEffect(() => {
    loadDesigners();
  }, []);

  const loadDesigners = async () => {
    const data = await dataService.getDesigners();
    setDesigners(data);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#26262E] pb-6">
        <h1 className="font-serif text-3xl font-bold text-white">Digital Fashion Designers Directory</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Discover independent couture ateliers, digital garment creators, and sustainable textile studios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designers.map(des => (
          <Card key={des.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="relative h-32 rounded-xl overflow-hidden bg-[#16161A] mb-4">
                {des.coverUrl && <img src={des.coverUrl} alt={des.brandName} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <img src={des.logoUrl} alt={des.brandName} className="w-10 h-10 rounded-full border border-[#D4AF37] object-cover" />
                  <div>
                    <h3 className="font-serif font-bold text-white text-base flex items-center gap-1">
                      {des.brandName} {des.verificationStatus === 'approved' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-4">{des.bio}</p>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#16161A] border border-[#26262E] text-center text-xs mb-4">
                <div>
                  <span className="text-gray-400 block text-[10px]">Followers</span>
                  <span className="font-bold text-white">{des.followerCount?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Designs</span>
                  <span className="font-bold text-white">{des.designsCount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Collections</span>
                  <span className="font-bold text-white">{des.collectionsCount}</span>
                </div>
              </div>
            </div>

            <Button variant="gold" size="sm" className="w-full">
              <UserPlus className="w-4 h-4" /> Follow Designer
            </Button>
          </Card>
        ))}
      </div>

    </div>
  );
};
