import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { ColorPalette } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Palette, Plus, Copy } from 'lucide-react';

export const ColorPalettesView: React.FC = () => {
  const { showToast } = useToast();
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);

  useEffect(() => {
    loadPalettes();
  }, []);

  const loadPalettes = async () => {
    const data = await dataService.getColorPalettes();
    setPalettes(data);
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied HEX "${hex}" to clipboard!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#26262E] pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Color Palette System</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Couture color harmony collections with HEX code export.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {palettes.map(pal => (
          <Card key={pal.id} className="p-6">
            <h4 className="font-serif text-xl font-bold text-white mb-1">{pal.name}</h4>
            <p className="text-xs text-gray-400 mb-4">{pal.description}</p>

            <div className="grid grid-cols-4 gap-3">
              {pal.colors.map((hex, idx) => (
                <div 
                  key={idx} 
                  onClick={() => copyHex(hex)} 
                  className="group relative h-20 rounded-2xl p-2 flex flex-col justify-end border border-white/10 cursor-pointer shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: hex }}
                >
                  <span className={`text-[10px] font-bold font-mono ${['#FFFFFF', '#FBF9F5', '#F4EFEA', '#F4E08D'].includes(hex.toUpperCase()) ? 'text-black' : 'text-white'}`}>
                    {hex}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
