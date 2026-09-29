import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0B0D] border-t border-[#26262E] py-12 text-gray-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#C5A059] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-serif text-lg font-bold text-white">Style<span className="text-[#D4AF37]">Sense</span></span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Startup-grade fashion technology connecting personal wardrobe management, AI styling, visual outfit matching, and professional digital garment design.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">User Experience</h4>
            <ul className="space-y-2">
              <li>Digital Wardrobe Management</li>
              <li>Visual Flatlay Outfit Builder</li>
              <li>Style My Wardrobe Engine</li>
              <li>"I Only Have..." NL Styling</li>
              <li>Visual Search Inspiration</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Designer Studio</h4>
            <ul className="space-y-2">
              <li>Digital Garment Design Tool</li>
              <li>Fabric & Material Library</li>
              <li>Pattern & Color Systems</li>
              <li>Couture Collections Manager</li>
              <li>Designer Marketplace</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Platform Specs</h4>
            <div className="space-y-2">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#16161A] text-gray-300 border border-[#26262E] text-[11px] mr-2">React 18</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#16161A] text-gray-300 border border-[#26262E] text-[11px] mr-2">Vite + TS</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#16161A] text-gray-300 border border-[#26262E] text-[11px] mr-2">Tailwind CSS</span>
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#16161A] text-gray-300 border border-[#26262E] text-[11px] mr-2">Supabase RLS</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#26262E] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">
            &copy; 2026 StyleSense Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Supabase Row Level Security Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
