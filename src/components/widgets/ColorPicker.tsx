import React from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export const FASHION_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#16161A' },
  { name: 'Blue', hex: '#2B5B84' },
  { name: 'Beige', hex: '#E2D1C3' },
  { name: 'Brown', hex: '#795548' },
  { name: 'Green', hex: '#4A6B53' },
  { name: 'Red', hex: '#C0392B' },
  { name: 'Pink', hex: '#E8A598' },
  { name: 'Yellow', hex: '#F39C12' },
  { name: 'Purple', hex: '#8E44AD' },
  { name: 'Grey', hex: '#7F8C8D' },
  { name: 'Navy', hex: '#1B263B' },
  { name: 'Gold', hex: '#D4AF37' }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onSelectColor
}) => {
  return (
    <div className="flex flex-wrap gap-2.5">
      {FASHION_COLORS.map(c => {
        const isSelected = selectedColor === c.name || selectedColor === c.hex;
        return (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelectColor(c.name)}
            title={c.name}
            className={`group relative w-9 h-9 rounded-full flex items-center justify-center transition-all transform ${
              isSelected ? 'scale-110 ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-[#0B0B0D]' : 'hover:scale-105'
            }`}
            style={{ backgroundColor: c.hex, border: c.name === 'White' ? '1px solid #444' : 'none' }}
          >
            {isSelected && (
              <Check className={`w-4 h-4 ${['White', 'Beige', 'Yellow', 'Pink'].includes(c.name) ? 'text-black' : 'text-white'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
