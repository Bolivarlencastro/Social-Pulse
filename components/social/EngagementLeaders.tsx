
import React from 'react';
import { USERS } from '../../constants';
import { Icon } from '../Icon';

const leaders = [
  { userId: 'user-1', points: 2450, badge: 'Knowledge Sharer' },
  { userId: 'user-2', points: 1980, badge: 'Feedback Master' },
  { userId: 'user-3', points: 1240, badge: 'Active Learner' },
];

export const EngagementLeaders: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="workspace_premium" size="sm" className="text-yellow-500" />
        Líderes de Engajamento
      </h3>
      <div className="space-y-4">
        {leaders.map((leader, i) => {
          const user = USERS[leader.userId];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="relative">
                <img src={user.avatarUrl} className="w-10 h-10 rounded-full border border-gray-100" alt="" />
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                <p className="text-[10px] text-purple-600 font-medium uppercase tracking-wider">{leader.badge}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{leader.points}</p>
                <p className="text-[10px] text-gray-400">pts</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
