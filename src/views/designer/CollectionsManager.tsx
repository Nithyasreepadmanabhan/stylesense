import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { DesignCollection } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Compass, Plus } from 'lucide-react';

export const CollectionsManager: React.FC = () => {
  const [collections, setCollections] = useState<DesignCollection[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    const data = await dataService.getCollections();
    setCollections(data);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="border-b border-[#26262E] pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Design Collections Manager</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Organize digital designs into seasonal runway collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map(col => (
          <Card key={col.id} className="p-6">
            <div className="relative h-48 rounded-2xl overflow-hidden bg-[#16161A] mb-4">
              <img src={col.coverImageUrl} alt={col.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <Badge variant="gold" className="mb-1">{col.season} {col.year}</Badge>
                <h3 className="font-serif text-2xl font-bold text-white">{col.name}</h3>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{col.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
