
import React from 'react';
import { Icon } from '../Icon';
import { USERS, CHANNELS_MAP } from '../../constants';

interface PulseLog {
    id: string;
    userId: string;
    action: 'Post' | 'Comentário' | 'Curtida' | 'Compartilhamento';
    channelId: string;
    timestamp: string;
    sentiment: 'positivo' | 'neutro' | 'alerta';
    preview: string;
}

const pulseLogs: PulseLog[] = [
    { id: '1', userId: 'user-1', action: 'Post', channelId: 'channel-1', timestamp: '20/10/2023 14:20', sentiment: 'positivo', preview: 'Acabei de publicar um novo guia...' },
    { id: '2', userId: 'user-2', action: 'Comentário', channelId: 'channel-1', timestamp: '20/10/2023 15:10', sentiment: 'positivo', preview: 'Excelente conteúdo! Já estou aplicando...' },
    { id: '3', userId: 'user-3', action: 'Post', channelId: 'channel-3', timestamp: '21/10/2023 09:45', sentiment: 'neutro', preview: 'Como vocês estão lidando com...' },
    { id: '4', userId: 'user-1', action: 'Curtida', channelId: 'channel-2', timestamp: '21/10/2023 10:02', sentiment: 'positivo', preview: 'Curtiu o post de Bob Williams' },
    { id: '5', userId: 'user-2', action: 'Comentário', channelId: 'channel-3', timestamp: '21/10/2023 11:30', sentiment: 'alerta', preview: 'Acho que esse roadmap está muito...' },
];

export const PulsesTable: React.FC = () => {
    const getSentimentBadge = (sentiment: PulseLog['sentiment']) => {
        const config = {
            positivo: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', label: 'Positivo' },
            neutro: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400', label: 'Neutro' },
            alerta: { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500', label: 'Alerta' },
        };
        const { bg, text, dot, label } = config[sentiment];
        return (
            <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${bg} ${text}`}>
                <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                {label}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuário</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ação</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Canal</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Data/Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sentimento</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Conteúdo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {pulseLogs.map((log) => {
                            const user = USERS[log.userId];
                            const channel = CHANNELS_MAP[log.channelId];
                            return (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-gray-200" alt="" />
                                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {log.action}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {channel?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.timestamp}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getSentimentBadge(log.sentiment)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {log.preview}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
