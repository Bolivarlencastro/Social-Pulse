
import React from 'react';
import { Icon } from '../Icon';

const topics = [
  { name: '#ReactServerComponents', count: 124, trend: 'up' },
  { name: '#DesignSystems', count: 89, trend: 'up' },
  { name: '#FeedbackCultura', count: 56, trend: 'down' },
  { name: '#NovosRoadmaps', count: 42, trend: 'up' },
  { name: '#IAnaEducação', count: 38, trend: 'up' },
];

export const TopTopics: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="trending_up" size="sm" className="text-purple-600" />
        Trending Topics
      </h3>
      <div className="space-y-4">
        {topics.map((topic, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                {topic.name}
              </p>
              <p className="text-xs text-gray-500">{topic.count} pulses hoje</p>
            </div>
            <Icon 
              name={topic.trend === 'up' ? 'arrow_upward' : 'arrow_downward'} 
              size="sm" 
              className={topic.trend === 'up' ? 'text-green-500' : 'text-red-400'} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};
