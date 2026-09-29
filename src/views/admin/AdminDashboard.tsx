import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { PlatformAnalytics } from '../../types/admin';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatsCard } from '../../components/widgets/StatsCard';
import { 
  Users, 
  Palette, 
  Scissors, 
  ShieldAlert, 
  ShoppingBag, 
  BarChart3, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await dataService.getAnalytics();
    setAnalytics(data);
  };

  if (!analytics) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Admin Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1D1212] via-[#16161A] to-[#0B0B0D] border border-red-500/30 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-md-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold uppercase mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Platform Executive Admin Suite
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Platform Oversight & Analytics</h1>
          </div>

          <Button variant="gold" onClick={() => onNavigate('admin-moderation')}>
            <ShieldAlert className="w-4 h-4" /> Moderation Queue ({analytics.pendingDesignApprovals + analytics.pendingDesignerApprovals})
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={analytics.totalUsers.toLocaleString()}
          subtitle={`${analytics.activeUsers.toLocaleString()} Monthly Active`}
          icon={<Users className="w-5 h-5" />}
          trend="+18%"
        />
        <StatsCard
          title="Verfied Designers"
          value={analytics.totalDesigners.toLocaleString()}
          subtitle={`${analytics.pendingDesignerApprovals} Pending Approvals`}
          icon={<Palette className="w-5 h-5" />}
          trend="+12%"
        />
        <StatsCard
          title="Digital Designs"
          value={analytics.totalDesigns.toLocaleString()}
          subtitle={`${analytics.pendingDesignApprovals} Pending Review`}
          icon={<Scissors className="w-5 h-5" />}
          trend="+34%"
        />
        <StatsCard
          title="Total Outfits Created"
          value={analytics.totalOutfits.toLocaleString()}
          subtitle="AI Combinatorial Looks"
          icon={<Sparkles className="w-5 h-5" />}
          trend="+42%"
        />
      </div>

      {/* Recharts Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* User & Designer Growth Chart */}
        <Card className="p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" /> Platform Growth Dynamics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.userGrowth}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121215', borderColor: '#26262E', color: '#FFF' }} />
                <Area type="monotone" dataKey="users" stroke="#D4AF37" fillOpacity={1} fill="url(#userGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Popularity Bar Chart */}
        <Card className="p-6">
          <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" /> Wardrobe Category Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryPopularity}>
                <XAxis dataKey="category" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121215', borderColor: '#26262E', color: '#FFF' }} />
                <Bar dataKey="count" fill="#8B9D83" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};
