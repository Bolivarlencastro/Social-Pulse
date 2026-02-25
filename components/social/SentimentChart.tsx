
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Seg', pulses: 400, sentiment: 80 },
  { name: 'Ter', pulses: 300, sentiment: 75 },
  { name: 'Qua', pulses: 600, sentiment: 85 },
  { name: 'Qui', pulses: 800, sentiment: 90 },
  { name: 'Sex', pulses: 500, sentiment: 88 },
  { name: 'Sáb', pulses: 200, sentiment: 95 },
  { name: 'Dom', pulses: 150, sentiment: 92 },
];

export const SentimentChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPulses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="pulses" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPulses)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
