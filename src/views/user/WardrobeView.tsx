import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { WardrobeItem, ClothingCategory, ColorTone, SeasonType, OccasionType, StyleType, PatternType, WardrobeSubcategory } from '../../types/wardrobe';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/widgets/ImageUploader';
import { ColorPicker } from '../../components/widgets/ColorPicker';
import { 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Trash2, 
  Edit, 
  Shirt, 
  Tag, 
  Calendar, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

export const WardrobeView: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [colorFilter, setColorFilter] = useState<string>('all');
  const [occasionFilter, setOccasionFilter] = useState<string>('all');
  const [styleFilter, setStyleFilter] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

  // New Item Form Data
  const [formData, setFormData] = useState({
    name: '',
    category: 'Top' as any,
    subcategory: 'Shirt' as any,
    brand: '',
    color: 'White' as any,
    secondaryColor: undefined as any,
    material: '',
    pattern: 'Solid' as any,
    style: 'Casual' as any,
    season: 'All Season' as any,
    occasion: 'Casual' as any,
    size: 'M',
    purchasePrice: 0,
    imageUrl: '',
    notes: ''
  });

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    const data = await dataService.getWardrobe(currentUser.id);
    setItems(data);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      showToast('Item name and image are required.', 'error');
      return;
    }

    if (editingItem) {
      await dataService.updateWardrobeItem(editingItem.id, formData);
      showToast(`Updated "${formData.name}" successfully!`);
    } else {
      await dataService.addWardrobeItem({
        ...formData,
        userId: currentUser.id,
        isFavorite: false
      });
      showToast(`Added "${formData.name}" to your digital wardrobe!`);
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
    resetForm();
    loadWardrobe();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete "${name}" from your wardrobe?`)) {
      await dataService.deleteWardrobeItem(id);
      showToast(`Deleted "${name}".`, 'info');
      loadWardrobe();
    }
  };

  const handleToggleFavorite = async (item: WardrobeItem) => {
    await dataService.updateWardrobeItem(item.id, { isFavorite: !item.isFavorite });
    showToast(item.isFavorite ? 'Removed from favorites' : 'Marked as favorite');
    loadWardrobe();
  };

  const openEditModal = (item: WardrobeItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      brand: item.brand || '',
      color: item.color,
      secondaryColor: item.secondaryColor || undefined,
      material: item.material || '',
      pattern: item.pattern,
      style: item.style,
      season: item.season,
      occasion: item.occasion,
      size: item.size || 'M',
      purchasePrice: item.purchasePrice || 0,
      imageUrl: item.imageUrl,
      notes: item.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Top' as ClothingCategory,
      subcategory: 'Shirt',
      brand: '',
      color: 'White' as ColorTone,
      secondaryColor: undefined,
      material: '',
      pattern: 'Solid' as PatternType,
      style: 'Casual' as StyleType,
      season: 'All Season' as SeasonType,
      occasion: 'Casual' as OccasionType,
      size: 'M',
      purchasePrice: 0,
      imageUrl: '',
      notes: ''
    });
  };

  // Filtered Items
  const filteredItems = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchColor = colorFilter === 'all' || item.color === colorFilter;
    const matchOccasion = occasionFilter === 'all' || item.occasion === occasionFilter;
    const matchStyle = styleFilter === 'all' || item.style === styleFilter;
    const matchFav = !favoritesOnly || item.isFavorite;

    return matchSearch && matchCat && matchColor && matchOccasion && matchStyle && matchFav;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#26262E] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Digital Wardrobe</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Catalog, organize, and filter your fashion items with detailed attributes.</p>
        </div>
        
        <Button variant="gold" onClick={() => { resetForm(); setEditingItem(null); setIsAddModalOpen(true); }}>
          <Plus className="w-4 h-4" /> Catalog New Item
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#121215] border border-[#26262E] p-4 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <Input
            placeholder="Search wardrobe by name, brand, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />

          <Select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'Top', label: 'Tops & Shirts' },
              { value: 'Bottom', label: 'Bottoms & Trousers' },
              { value: 'Dress', label: 'Dresses & Sarees' },
              { value: 'Jacket', label: 'Outerwear & Blazers' },
              { value: 'Shoes', label: 'Footwear' },
              { value: 'Accessories', label: 'Accessories' },
              { value: 'Bag', label: 'Bags' }
            ]}
          />

          <Select
            value={occasionFilter}
            onChange={e => setOccasionFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Occasions' },
              { value: 'College', label: 'College' },
              { value: 'Office', label: 'Office' },
              { value: 'Interview', label: 'Interview' },
              { value: 'Date', label: 'Date' },
              { value: 'Party', label: 'Party' },
              { value: 'Casual', label: 'Casual' },
              { value: 'Formal', label: 'Formal' },
              { value: 'Wedding', label: 'Wedding' }
            ]}
          />

          <div className="flex items-center gap-2">
            <Select
              value={styleFilter}
              onChange={e => setStyleFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Styles' },
                { value: 'Minimal', label: 'Minimal' },
                { value: 'Casual', label: 'Casual' },
                { value: 'Smart Casual', label: 'Smart Casual' },
                { value: 'Streetwear', label: 'Streetwear' },
                { value: 'Formal', label: 'Formal' },
                { value: 'Luxury', label: 'Luxury' }
              ]}
            />

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`p-2.5 rounded-xl border transition-all ${
                favoritesOnly ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-[#16161A] text-gray-400 border-[#26262E] hover:text-white'
              }`}
              title="Favorites Only"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

        </div>
      </div>

      {/* Wardrobe Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="p-3 group flex flex-col justify-between">
              <div>
                {/* Image Container */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-[#16161A] mb-3">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  <button
                    onClick={() => handleToggleFavorite(item)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-full font-medium">
                    {item.color}
                  </span>
                </div>

                <Badge variant="dark" className="text-[9px] mb-1">{item.category}</Badge>
                <h4 className="font-semibold text-xs text-white truncate" title={item.name}>{item.name}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{item.brand || 'Unbranded'} • {item.style}</p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-2 border-t border-[#26262E] flex justify-between items-center text-xs">
                <span className="text-[10px] text-gray-400">{item.occasion}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEditModal(item)} className="p-1 text-gray-400 hover:text-white">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id, item.name)} className="p-1 text-gray-400 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center my-6">
          <Shirt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-white">No Wardrobe Items Found</h3>
          <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">
            Try adjusting your search filter or catalog your first fashion item using the button above.
          </p>
        </Card>
      )}

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingItem ? 'Edit Wardrobe Item' : 'Catalog New Wardrobe Item'}
        subtitle="Specify exact attributes for AI recommendation scoring"
      >
        <form onSubmit={handleSaveItem} className="space-y-4">
          <Input
            label="Item Name *"
            placeholder="e.g. White Oversized Linen Shirt"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category *"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as ClothingCategory })}
              options={[
                { value: 'Top', label: 'Top' },
                { value: 'Bottom', label: 'Bottom' },
                { value: 'Dress', label: 'Dress / Saree' },
                { value: 'Jacket', label: 'Outerwear / Blazer' },
                { value: 'Shoes', label: 'Shoes / Footwear' },
                { value: 'Accessories', label: 'Accessories' },
                { value: 'Bag', label: 'Bag' }
              ]}
            />

            <Input
              label="Subcategory"
              placeholder="e.g. Linen Shirt, Jeans, Sneakers"
              value={formData.subcategory}
              onChange={e => setFormData({ ...formData, subcategory: e.target.value as any })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Brand"
              placeholder="e.g. COS, Acne Studios, Zara"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value })}
            />

            <Select
              label="Style Aesthetic *"
              value={formData.style}
              onChange={e => setFormData({ ...formData, style: e.target.value as StyleType })}
              options={[
                { value: 'Minimal', label: 'Minimalist' },
                { value: 'Casual', label: 'Casual' },
                { value: 'Smart Casual', label: 'Smart Casual' },
                { value: 'Streetwear', label: 'Streetwear' },
                { value: 'Formal', label: 'Formal' },
                { value: 'Luxury', label: 'Luxury' },
                { value: 'Traditional', label: 'Traditional' },
                { value: 'Vintage', label: 'Vintage' }
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Primary Color *</label>
            <ColorPicker
              selectedColor={formData.color}
              onSelectColor={color => setFormData({ ...formData, color: color as ColorTone })}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Season"
              value={formData.season}
              onChange={e => setFormData({ ...formData, season: e.target.value as SeasonType })}
              options={[
                { value: 'All Season', label: 'All Season' },
                { value: 'Summer', label: 'Summer' },
                { value: 'Winter', label: 'Winter' },
                { value: 'Spring', label: 'Spring' },
                { value: 'Autumn', label: 'Autumn' }
              ]}
            />

            <Select
              label="Occasion"
              value={formData.occasion}
              onChange={e => setFormData({ ...formData, occasion: e.target.value as OccasionType })}
              options={[
                { value: 'Casual', label: 'Casual' },
                { value: 'College', label: 'College' },
                { value: 'Office', label: 'Office' },
                { value: 'Interview', label: 'Interview' },
                { value: 'Date', label: 'Date' },
                { value: 'Party', label: 'Party' },
                { value: 'Wedding', label: 'Wedding' }
              ]}
            />

            <Input
              label="Purchase Price ($)"
              type="number"
              placeholder="110"
              value={formData.purchasePrice || ''}
              onChange={e => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
            />
          </div>

          <ImageUploader
            label="Wardrobe Item Photo *"
            value={formData.imageUrl}
            onChange={url => setFormData({ ...formData, imageUrl: url })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#26262E]">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="gold">{editingItem ? 'Save Changes' : 'Catalog Item'}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
