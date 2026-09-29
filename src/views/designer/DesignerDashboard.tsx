import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { DigitalDesign, DesignerProfile } from '../../types/designer';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatsCard } from '../../components/widgets/StatsCard';
import { 
  Scissors, 
  Layers, 
  Grid, 
  Palette, 
  Compass, 
  Eye, 
  Heart, 
  Bookmark, 
  Plus, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DesignerDashboardProps {
  onNavigate: (view: string) => void;
}

export const DesignerDashboard: React.FC<DesignerDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [designs, setDesigns] = useState<DigitalDesign[]>([]);

  useEffect(() => {
    loadStudio();
  }, []);

  const loadStudio = async () => {
    const designers = await dataService.getDesigners();
    const current = designers.find(d => d.userId === currentUser.id) || designers[0];
    setDesigner(current);

    const dList = await dataService.getDesigns(current.id);
    setDesigns(dList);
  };

  if (!designer) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Studio Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#16161A] via-[#121215] to-[#0B0B0D] border border-[#26262E] p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <img src={designer.logoUrl} alt={designer.brandName} className="w-20 h-20 rounded-2xl border-2 border-[#D4AF37] object-cover shadow-luxe-gold" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-bold text-white">{designer.brandName}</h1>
                <Badge variant={designer.verificationStatus === 'approved' ? 'gold' : 'terracotta'}>
                  {designer.verificationStatus}
                </Badge>
              </div>
              <p className="text-gray-400 text-xs max-w-xl">{designer.bio}</p>
            </div>
          </div>

          <Button variant="gold" onClick={() => onNavigate('designer-canvas')}>
            <Scissors className="w-4 h-4" /> Launch Design Studio Tool
          </Button>
        </div>
      </div>

      {/* Analytics KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Published Designs"
          value={designs.filter(d => d.status === 'published').length}
          subtitle="Active on Marketplace"
          icon={<Scissors className="w-5 h-5" />}
          trend="+15%"
        />
        <StatsCard
          title="Total Design Views"
          value="18,420"
          subtitle="Across lookbooks & gallery"
          icon={<Eye className="w-5 h-5" />}
          trend="+28%"
        />
        <StatsCard
          title="Design Likes"
          value="4,280"
          subtitle="User engagement"
          icon={<Heart className="w-5 h-5" />}
          trend="+32%"
        />
        <StatsCard
          title="Brand Followers"
          value={designer.followerCount?.toLocaleString() || '14,200'}
          subtitle="Community size"
          icon={<Sparkles className="w-5 h-5" />}
          trend="+8%"
        />
      </div>

      {/* Quick Studio Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Button variant="dark" onClick={() => onNavigate('designer-canvas')} className="w-full py-4 flex-col gap-2 rounded-2xl">
          <Scissors className="w-5 h-5 text-[#D4AF37]" />
          <span className="text-xs">New Design</span>
        </Button>
        <Button variant="dark" onClick={() => onNavigate('designer-fabrics')} className="w-full py-4 flex-col gap-2 rounded-2xl">
          <Layers className="w-5 h-5 text-purple-400" />
          <span className="text-xs">Fabrics Library</span>
        </Button>
        <Button variant="dark" onClick={() => onNavigate('designer-patterns')} className="w-full py-4 flex-col gap-2 rounded-2xl">
          <Grid className="w-5 h-5 text-emerald-400" />
          <span className="text-xs">Patterns Library</span>
        </Button>
        <Button variant="dark" onClick={() => onNavigate('designer-palettes')} className="w-full py-4 flex-col gap-2 rounded-2xl">
          <Palette className="w-5 h-5 text-amber-400" />
          <span className="text-xs">Color Palettes</span>
        </Button>
        <Button variant="dark" onClick={() => onNavigate('designer-collections')} className="w-full py-4 flex-col gap-2 rounded-2xl col-span-2 sm:col-span-1">
          <Compass className="w-5 h-5 text-rose-400" />
          <span className="text-xs">Collections</span>
        </Button>
      </div>

      {/* Recent Designs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-2xl font-bold text-white">Recent Digital Designs</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('designer-canvas')}>
            Create Design <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {designs.slice(0, 3).map(des => (
            <Card key={des.id} className="p-4 group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#16161A] mb-3">
                <img src={des.previewImageUrl} alt={des.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <Badge 
                  variant={des.status === 'published' ? 'gold' : des.status === 'submitted' ? 'terracotta' : 'dark'}
                  className="absolute top-3 left-3 text-[9px]"
                >
                  {des.status}
                </Badge>
              </div>

              <h4 className="font-serif text-base font-bold text-white group-hover:text-[#D4AF37] truncate">{des.name}</h4>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{des.description}</p>

              <div className="mt-4 pt-3 border-t border-[#26262E] flex justify-between text-xs text-gray-400">
                <span>{des.viewsCount} Views</span>
                <span>{des.likesCount} Likes</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
