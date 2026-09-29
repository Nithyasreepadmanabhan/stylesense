import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  variant?: 'gold' | 'dark' | 'outline' | 'sage' | 'terracotta' | 'success';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  className,
  children
}) => {
  const variants = {
    gold: "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30",
    dark: "bg-[#1E1E24] text-gray-300 border border-[#26262E]",
    outline: "border border-gray-700 text-gray-400",
    sage: "bg-[#8B9D83]/20 text-[#8B9D83] border border-[#8B9D83]/30",
    terracotta: "bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/30",
    success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide inline-flex items-center gap-1 uppercase", variants[variant], className)}>
      {children}
    </span>
  );
};
