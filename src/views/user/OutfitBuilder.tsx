import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { WardrobeItem, OccasionType, StyleType, SeasonType } from '../../types/wardrobe';
import { Outfit, OutfitCompositionItem } from '../../types/outfit';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Layers, Plus, Trash2, Save, Sparkles, Shirt, Heart, RefreshCw } from 'lucide-react';

export const OutfitBuilder: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<OutfitCompositionItem[]>([]);
  
  // Outfit Meta Details
  const [outfitName, setOutfitName] = useState('');
  const [description, setDescription] = useState('');
  const [occasion, setOccasion] = useState<OccasionType>('College');
  const [style, setStyle] = useState<StyleType>('Minimal');
  const [season, setSeason] = useState<SeasonType>('Summer');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    const data = await dataService.getWardrobe(currentUser.id);
    setWardrobe(data);
  };

  const addItemToCanvas = (item: WardrobeItem) => {
    const exists = selectedItems.some(i => i.wardrobeItem.id === item.id);
    if (exists) {
      showToast(`Item "${item.name}" already added.`, 'info');
      return;
    }

    const newItem: OutfitCompositionItem = {
      id: `comp-${Date.now()}-${item.id}`,
      wardrobeItem: item,
      position: { x: 50, y: 50, scale: 1 }
    };
    setSelectedItems(prev => [...prev, newItem]);
    showToast(`Added "${item.name}" to outfit composition.`);
  };

  const removeItemFromCanvas = (compId: string) => {
    setSelectedItems(prev => prev.filter(i => i.id !== compId));
  };

  const handleSaveOutfit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      showToast('Please add at least one wardrobe item to build an outfit.', 'error');
      return;
    }

    if (!outfitName.trim()) {
      showToast('Please enter an outfit name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const colorPalette = Array.from(new Set(selectedItems.map(i => i.wardrobeItem.color)));

      const newOutfit: Omit<Outfit, 'id' | 'createdAt'> = {
        userId: currentUser.id,
        name: outfitName,
        description,
        occasion,
        style,
        season,
        colorPalette,
        coverImageUrl: selectedItems[0]?.wardrobeItem.imageUrl,
        items: selectedItems,
        isPublic: true,
        isFavorite: true,
        score: Math.floor(Math.random() * 10) + 90
      };

      await dataService.saveOutfit(newOutfit);
      showToast(`Outfit "${outfitName}" saved to lookbook! ✨`);
      setSelectedItems([]);
      setOutfitName('');
      setDescription('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="border-b border-[#26262E] pb-6">
        <h1 className="font-serif text-3xl font-bold text-white">Visual Flatlay Outfit Builder</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Combine tops, bottoms, outerwear, shoes, and accessories into custom outfit flatlays.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (7 Cols): Flatlay Composition Canvas */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 bg-gradient-to-b from-[#16161A] to-[#0F0F11] border-[#D4AF37]/30 shadow-2xl relative min-h-[500px] flex flex-col justify-between">
            
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-[#26262E] pb-4 mb-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Layers className="w-5 h-5" />
                <span className="font-serif font-bold text-white text-lg">Flatlay Composition Canvas</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="gold">{selectedItems.length} Items</Badge>
                {selectedItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                    Clear Canvas
                  </Button>
                )}
              </div>
            </div>

            {/* Canvas Area */}
            {selectedItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto p-4 bg-[#0B0B0D]/60 rounded-2xl border border-[#26262E]/80 backdrop-blur-md">
                {selectedItems.map((comp) => (
                  <div key={comp.id} className="relative group bg-[#16161A] border border-[#26262E] rounded-2xl p-3 flex flex-col items-center text-center">
                    <button
                      onClick={() => removeItemFromCanvas(comp.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <img src={comp.wardrobeItem.imageUrl} alt={comp.wardrobeItem.name} className="w-24 h-24 object-cover rounded-xl mb-2" />
                    <Badge variant="dark" className="text-[9px] mb-1">{comp.wardrobeItem.category}</Badge>
                    <span className="text-xs font-semibold text-white line-clamp-1">{comp.wardrobeItem.name}</span>
                    <span className="text-[10px] text-gray-400">{comp.wardrobeItem.color}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-gray-500">
                <Shirt className="w-16 h-16 text-gray-600 mb-3 animate-pulse" />
                <h4 className="font-serif text-lg font-semibold text-gray-300">Canvas Empty</h4>
                <p className="text-xs max-w-xs text-gray-500 mt-1">Select items from your wardrobe palette on the right to start composing your look.</p>
              </div>
            )}

            {/* Canvas Footer Bar */}
            <div className="pt-4 border-t border-[#26262E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Palette Tones:</span>
                {Array.from(new Set(selectedItems.map(i => i.wardrobeItem.color))).map(col => (
                  <span key={col} className="px-2 py-0.5 rounded-full bg-[#16161A] border border-gray-700 text-[10px] text-gray-300">
                    {col}
                  </span>
                ))}
              </div>
            </div>

          </Card>

          {/* Outfit Save Details Form */}
          <Card className="p-6">
            <h4 className="font-serif text-lg font-bold text-white mb-4">Save Outfit Details</h4>
            
            <form onSubmit={handleSaveOutfit} className="space-y-4">
              <Input
                label="Outfit Name *"
                placeholder="e.g. Executive Boardroom Look, Minimalist Coffee Date"
                value={outfitName}
                onChange={e => setOutfitName(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Occasion"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value as OccasionType)}
                  options={[
                    { value: 'College', label: 'College' },
                    { value: 'Office', label: 'Office' },
                    { value: 'Interview', label: 'Interview' },
                    { value: 'Date', label: 'Date' },
                    { value: 'Party', label: 'Party' },
                    { value: 'Wedding', label: 'Wedding' },
                    { value: 'Casual', label: 'Casual' }
                  ]}
                />

                <Select
                  label="Style"
                  value={style}
                  onChange={e => setStyle(e.target.value as StyleType)}
                  options={[
                    { value: 'Minimal', label: 'Minimalist' },
                    { value: 'Casual', label: 'Casual' },
                    { value: 'Smart Casual', label: 'Smart Casual' },
                    { value: 'Streetwear', label: 'Streetwear' },
                    { value: 'Formal', label: 'Formal' },
                    { value: 'Luxury', label: 'Luxury' }
                  ]}
                />

                <Select
                  label="Season"
                  value={season}
                  onChange={e => setSeason(e.target.value as SeasonType)}
                  options={[
                    { value: 'Summer', label: 'Summer' },
                    { value: 'Winter', label: 'Winter' },
                    { value: 'Spring', label: 'Spring' },
                    { value: 'Autumn', label: 'Autumn' },
                    { value: 'All Season', label: 'All Season' }
                  ]}
                />
              </div>

              <Button type="submit" variant="gold" className="w-full py-3" isLoading={isSaving}>
                <Save className="w-4 h-4" /> Save Outfit to Lookbook
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Col (5 Cols): Wardrobe Picker Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 h-full max-h-[800px] flex flex-col">
            <h4 className="font-serif text-lg font-bold text-white mb-2">Wardrobe Palette</h4>
            <p className="text-xs text-gray-400 mb-4">Click items to add them into your outfit composition.</p>

            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-3 pr-1">
              {wardrobe.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => addItemToCanvas(item)}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#16161A] border border-[#26262E] hover:border-[#D4AF37]/60 cursor-pointer transition-all hover:translate-x-1 group"
                >
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white group-hover:text-[#D4AF37] truncate">{item.name}</h5>
                    <p className="text-[10px] text-gray-400">{item.category} • {item.color}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 p-1.5">
                    <Plus className="w-4 h-4 text-[#D4AF37]" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
