import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { WishlistItem } from '../../types/product';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const Wishlist: React.FC = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await dataService.getWishlist(currentUser.id);
    setItems(data);
  };

  const handleRemove = async (item: WishlistItem) => {
    await dataService.toggleWishlist(currentUser.id, item.itemType, item.itemId);
    loadWishlist();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      <div className="border-b border-[#26262E] pb-6">
        <h1 className="font-serif text-3xl font-bold text-white">My Saved Wishlist ({items.length})</h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">Saved products, digital fashion designs, and favorite designer portfolios.</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(w => (
            <Card key={w.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="gold">{w.itemType}</Badge>
                  <button onClick={() => handleRemove(w)} className="text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {w.itemData && (
                  <div>
                    {w.itemData.imageUrls?.[0] && (
                      <img src={w.itemData.imageUrls[0]} alt={w.itemData.name} className="w-full h-44 object-cover rounded-xl mb-3" />
                    )}
                    <h4 className="font-serif text-lg font-bold text-white">{w.itemData.name}</h4>
                    {w.itemData.price && <p className="font-bold text-[#D4AF37] mt-1">{formatCurrency(w.itemData.price)}</p>}
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                View Saved Item
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Heart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-gray-400 text-xs mt-1">Explore the Marketplace or Designer Studio to save items.</p>
        </Card>
      )}

    </div>
  );
};
