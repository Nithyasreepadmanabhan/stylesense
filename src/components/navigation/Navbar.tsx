import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';
import { 
  Sparkles, 
  Heart, 
  Shirt, 
  Layers, 
  Wand2, 
  MessageSquareCode, 
  Camera, 
  ShoppingBag, 
  Palette, 
  Scissors, 
  Grid, 
  Compass, 
  ShieldAlert, 
  BarChart3, 
  User as UserIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, activeRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role-specific main navigation links
  const userNav = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'wardrobe', label: 'Wardrobe', icon: <Shirt className="w-4 h-4" /> },
    { id: 'outfits', label: 'Outfit Builder', icon: <Layers className="w-4 h-4" /> },
    { id: 'style-ai', label: 'Style My Wardrobe', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'natural-language', label: 'I Only Have...', icon: <MessageSquareCode className="w-4 h-4" /> },
    { id: 'visual-search', label: 'Visual Search', icon: <Camera className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'style-dna', label: 'Style DNA', icon: <UserIcon className="w-4 h-4" /> },
  ];

  const designerNav = [
    { id: 'designer-dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'designer-canvas', label: 'Design Studio', icon: <Scissors className="w-4 h-4" /> },
    { id: 'designer-fabrics', label: 'Fabrics', icon: <Layers className="w-4 h-4" /> },
    { id: 'designer-patterns', label: 'Patterns', icon: <Grid className="w-4 h-4" /> },
    { id: 'designer-palettes', label: 'Palettes', icon: <Palette className="w-4 h-4" /> },
    { id: 'designer-collections', label: 'Collections', icon: <Compass className="w-4 h-4" /> },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'admin-moderation', label: 'Moderation Queue', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'admin-users', label: 'User & Designer Management', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'admin-products', label: 'Products Catalog', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  const activeNavItems = activeRole === 'admin' ? adminNav : activeRole === 'designer' ? designerNav : userNav;

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0B0D]/90 backdrop-blur-xl border-b border-[#26262E] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(activeRole === 'admin' ? 'admin-dashboard' : activeRole === 'designer' ? 'designer-dashboard' : 'home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] via-[#F4E08D] to-[#C5A059] flex items-center justify-center shadow-luxe-gold">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                Style<span className="text-[#D4AF37]">Sense</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-sans -mt-1">
                AI Fashion Platform
              </span>
            </div>
          </div>

          {/* Role Navigation Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {activeNavItems.slice(0, 6).map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  currentView === item.id
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Actions: Role Switcher & User Profile */}
          <div className="hidden md:flex items-center gap-4">
            <RoleSwitcher />

            {activeRole === 'user' && (
              <button 
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-gray-300 hover:text-[#D4AF37] rounded-full hover:bg-white/5 relative transition-colors"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              </button>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-[#26262E]">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.fullName}
                className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/50"
              />
              <div className="hidden xl:block text-left">
                <span className="block text-xs font-bold text-white">{currentUser.fullName}</span>
                <span className="block text-[10px] text-[#D4AF37] uppercase tracking-wider font-semibold">{activeRole}</span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <RoleSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white rounded-xl bg-[#16161A]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121215] border-b border-[#26262E] px-4 pt-2 pb-6 space-y-1">
          {activeNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium ${
                currentView === item.id ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
