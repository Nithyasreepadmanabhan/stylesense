import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataService } from '../../services/dataService';
import { FabricMaterial } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { ImageUploader } from '../../components/widgets/ImageUploader';
import { Layers, Plus, Sparkles } from 'lucide-react';

export const FabricsLibrary: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [fabrics, setFabrics] = useState<FabricMaterial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: 'Silk' as FabricMaterial['category'],
    description: '',
    imageUrl: '',
    color: 'Ivory',
    weight: '120 gsm',
    stretch: 'None' as FabricMaterial['stretch'],
    transparency: 'Opaque' as FabricMaterial['transparency'],
    finish: 'Glossy' as FabricMaterial['finish'],
    recommendedUsage: ''
  });

  useEffect(() => {
    loadFabrics();
  }, []);

  const loadFabrics = async () => {
    const data = await dataService.getFabrics();
    setFabrics(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await dataService.addFabric({
      ...form,
      designerId: 'des-1'
    });
    showToast(`Added fabric "${form.name}" to library!`);
    setIsModalOpen(false);
    loadFabrics();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#26262E] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Fabrics & Materials Library</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Catalog custom textiles, stretch specifications, textures, and finish parameters.</p>
        </div>

        <Button variant="gold" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create New Material
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fabrics.map(fab => (
          <Card key={fab.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden bg-[#16161A] mb-4">
                <img src={fab.imageUrl} alt={fab.name} className="w-full h-full object-cover" />
                <Badge variant="gold" className="absolute top-3 left-3">{fab.category}</Badge>
              </div>

              <h4 className="font-serif text-lg font-bold text-white mb-1">{fab.name}</h4>
              <p className="text-xs text-gray-400 mb-3">{fab.description}</p>

              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#16161A] border border-[#26262E] text-xs">
                <div><span className="text-gray-400">Weight:</span> <strong className="text-white">{fab.weight}</strong></div>
                <div><span className="text-gray-400">Stretch:</span> <strong className="text-white">{fab.stretch}</strong></div>
                <div><span className="text-gray-400">Finish:</span> <strong className="text-white">{fab.finish}</strong></div>
                <div><span className="text-gray-400">Opacity:</span> <strong className="text-white">{fab.transparency}</strong></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Material Spec">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Material Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Select
            label="Fabric Category *"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value as any })}
            options={['Cotton', 'Silk', 'Linen', 'Denim', 'Wool', 'Polyester', 'Velvet', 'Satin', 'Chiffon', 'Leather', 'Custom'].map(c => ({ value: c, label: c }))}
          />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <ImageUploader label="Material Image" value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
          <div className="flex justify-end gap-2 pt-4 border-t border-[#26262E]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="gold">Save Material</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
