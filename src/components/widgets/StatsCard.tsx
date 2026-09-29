import React from 'react';
import { Card } from '../common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'positive'
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</span>
          <h3 className="font-serif text-3xl font-bold text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 pt-3 border-t border-[#26262E] flex items-center text-xs">
          <span className={trendType === 'positive' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
            {trend}
          </span>
          <span className="text-gray-400 ml-1.5">vs last month</span>
        </div>
      )}
    </Card>
  );
};
