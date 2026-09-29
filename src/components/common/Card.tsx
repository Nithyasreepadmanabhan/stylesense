import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hoverEffect = true,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-[#121215] border border-[#26262E] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300",
        hoverEffect && "hover:border-[#D4AF37]/50 hover:shadow-luxe hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
