import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';

// User Views
import { UserDashboard } from './views/user/UserDashboard';
import { WardrobeView } from './views/user/WardrobeView';
import { OutfitBuilder } from './views/user/OutfitBuilder';
import { StyleMyWardrobe } from './views/user/StyleMyWardrobe';
import { NaturalLanguageStyling } from './views/user/NaturalLanguageStyling';
import { VisualSearchInspiration } from './views/user/VisualSearchInspiration';
import { Marketplace } from './views/user/Marketplace';
import { DesignersDirectory } from './views/user/DesignersDirectory';
import { Wishlist } from './views/user/Wishlist';
import { StyleDnaProfile } from './views/user/StyleDnaProfile';

// Designer Views
import { DesignerDashboard } from './views/designer/DesignerDashboard';
import { DesignCanvasStudio } from './views/designer/DesignCanvasStudio';
import { FabricsLibrary } from './views/designer/FabricsLibrary';
import { PatternsLibrary } from './views/designer/PatternsLibrary';
import { ColorPalettesView } from './views/designer/ColorPalettesView';
import { CollectionsManager } from './views/designer/CollectionsManager';

// Admin Views
import { AdminDashboard } from './views/admin/AdminDashboard';
import { ModerationQueue } from './views/admin/ModerationQueue';

const AppContent: React.FC = () => {
  const { activeRole } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    // If Active Role is Admin, render admin workspace views
    if (activeRole === 'admin') {
      switch (currentView) {
        case 'admin-moderation':
          return <ModerationQueue />;
        case 'admin-dashboard':
        default:
          return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    // If Active Role is Designer, render designer studio views
    if (activeRole === 'designer') {
      switch (currentView) {
        case 'designer-canvas':
          return <DesignCanvasStudio />;
        case 'designer-fabrics':
          return <FabricsLibrary />;
        case 'designer-patterns':
          return <PatternsLibrary />;
        case 'designer-palettes':
          return <ColorPalettesView />;
        case 'designer-collections':
          return <CollectionsManager />;
        case 'designer-dashboard':
        default:
          return <DesignerDashboard onNavigate={handleNavigate} />;
      }
    }

    // Default User Platform Views
    switch (currentView) {
      case 'wardrobe':
        return <WardrobeView />;
      case 'outfits':
        return <OutfitBuilder />;
      case 'style-ai':
        return <StyleMyWardrobe />;
      case 'natural-language':
        return <NaturalLanguageStyling onNavigate={handleNavigate} />;
      case 'visual-search':
        return <VisualSearchInspiration onNavigate={handleNavigate} />;
      case 'marketplace':
        return <Marketplace />;
      case 'designers':
        return <DesignersDirectory />;
      case 'wishlist':
        return <Wishlist />;
      case 'style-dna':
        return <StyleDnaProfile />;
      case 'home':
      default:
        return <UserDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#FBF9F6] flex flex-col font-sans">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
