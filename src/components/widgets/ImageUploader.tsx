import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../common/Button';

interface ImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Image'
}) => {
  const [preview, setPreview] = useState<string>(value || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setPreview(url);
        onChange(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">{label}</label>}
      {preview ? (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#26262E] group">
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
            <Button variant="danger" size="sm" onClick={handleRemove}>
              <X className="w-4 h-4" /> Remove Image
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[#26262E] hover:border-[#D4AF37]/50 rounded-2xl cursor-pointer bg-[#16161A]/50 hover:bg-[#16161A] transition-all group p-4 text-center">
          <div className="p-4 rounded-full bg-white/5 text-gray-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-white">Click or Drag Image Here</span>
          <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, WEBP up to 10MB</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
};
