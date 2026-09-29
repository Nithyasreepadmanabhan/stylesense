import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { Product } from '../../types/product';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ShoppingBag, Search, Heart, Star, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const Marketplace: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await dataService.getProducts();
    setProducts(data);
  };

  const handleWishlist = async (product: Product) => {
    const added = await dataService.toggleWishlist(currentUser.id, 'product', product.id, product);
    showToast(added ? `Saved "${product.name}" to wishlist!` : `Removed "${product.name}" from wishlist.`);
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#26262E] pb-6 flex justify-between items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Fashion Marketplace & Catalog</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Discover designer apparel, shoes, and luxury accessories.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          placeholder="Search marketplace products by name or brand..."
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
            { value: 'Jacket', label: 'Outerwear & Blazers' },
            { value: 'Shoes', label: 'Shoes' },
            { value: 'Bag', label: 'Bags' },
            { value: 'Accessories', label: 'Accessories' }
          ]}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(prod => (
          <Card key={prod.id} className="p-4 group flex flex-col justify-between">
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#16161A] mb-3">
                <img src={prod.imageUrls[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => handleWishlist(prod)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-md text-gray-300 hover:text-rose-400 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <Badge variant="gold" className="absolute bottom-3 left-3 text-[9px]">{prod.brand}</Badge>
              </div>

              <h4 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">{prod.name}</h4>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{prod.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#26262E] flex items-center justify-between">
              <span className="font-serif text-lg font-bold text-white">{formatCurrency(prod.price)}</span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
