import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Pattern } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Grid, Plus } from 'lucide-react';

export const PatternsLibrary: React.FC = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    const data = await dataService.getPatterns();
    setPatterns(data);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#26262E] pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Pattern Library</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Floral, Geometric, Abstract, Jacquard, and Custom vector patterns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patterns.map(pat => (
          <Card key={pat.id} className="p-4">
            <img src={pat.previewUrl} alt={pat.name} className="w-full h-48 object-cover rounded-xl mb-3" />
            <Badge variant="gold" className="text-[9px] mb-1">{pat.category}</Badge>
            <h4 className="font-serif text-base font-bold text-white">{pat.name}</h4>
            <p className="text-xs text-gray-400 mt-1">{pat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
