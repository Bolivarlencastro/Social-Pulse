
import React from 'react';
import { Icon } from './Icon';

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon: string;
  color: 'purple' | 'blue' | 'green' | 'orange';
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, trend, icon, color }) => {
  const colorMap = {
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              <Icon name={trend.isUp ? 'trending_up' : 'trending_down'} size="sm" />
              <span>{trend.isUp ? '+' : '-'}{trend.value}% vs mês passado</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon name={icon} />
        </div>
      </div>
    </div>
  );
};
