import React, { useMemo } from 'react';
import { Course } from '../../types';
import { Icon } from '../Icon';

const calculateTotalDuration = (courses: Course[]): string => {
    let totalMinutes = 0;
    courses.forEach(course => {
        if (course.duration && course.duration !== '--.--') {
            const hMatch = course.duration.match(/(\d+)\s*h/);
            const mMatch = course.duration.match(/(\d+)\s*min/);
            const sMatch = course.duration.match(/(\d+)\s*s/);
            
            const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
            const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;
            const seconds = sMatch ? parseInt(sMatch[1], 10) : 0;

            totalMinutes += (hours * 60) + minutes + (seconds / 60);
        }
    });

    if (totalMinutes === 0) {
        return '0h 0min';
    }

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.round(totalMinutes % 60);

    return `${totalHours}h ${remainingMinutes}min`;
};

const SummaryMetric: React.FC<{ icon: string; value: number | string; label: string; }> = ({ icon, value, label }) => (
    <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
        <Icon name={icon} className="text-gray-500" />
        <div className="ml-4">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
        </div>
    </div>
);


export const SummaryPanel: React.FC<{ isOpen: boolean; onClose: () => void; courses: Course[] }> = ({ isOpen, onClose, courses }) => {
    
    const summaryStats = useMemo(() => {
        if (!courses) {
            return { totalCourses: 0, published: 0, inCreation: 0, totalEnrolled: 0, totalFinished: 0, totalDuration: '0h 0min' };
        }
        return {
            totalCourses: courses.length,
            published: courses.filter(c => c.status === 'Publicado').length,
            inCreation: courses.filter(c => c.status === 'Em Criação').length,
            totalEnrolled: courses.reduce((sum, c) => sum + c.enrolled, 0),
            totalFinished: courses.reduce((sum, c) => sum + c.finished, 0),
            totalDuration: calculateTotalDuration(courses),
        };
    }, [courses]);

    return (
        <div className={`fixed top-0 right-0 h-full z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <aside className="w-80 h-full bg-[#fdfcff] border-l border-gray-200 shadow-lg flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
                        <p className="text-sm text-gray-500 mt-1">Veja as principais informações desta tabela de dados.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
                        aria-label="Fechar resumo"
                    >
                        <Icon name="close" size="sm" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    <div className="p-4 border border-gray-200 bg-white rounded-lg flex items-center gap-3">
                        <Icon name="link" className="text-gray-500"/>
                        <p className="text-md font-medium text-gray-800">{summaryStats.totalCourses} total cursos</p>
                    </div>

                    <SummaryMetric icon="publish" value={summaryStats.published} label="Cursos Publicados" />
                    <SummaryMetric icon="pending_actions" value={summaryStats.inCreation} label="Cursos em Criação" />
                    <SummaryMetric icon="group" value={summaryStats.totalEnrolled.toLocaleString('pt-BR')} label="Total de Inscritos" />
                    <SummaryMetric icon="emoji_events" value={summaryStats.totalFinished.toLocaleString('pt-BR')} label="Total de Finalizações" />
                    <SummaryMetric icon="schedule" value={summaryStats.totalDuration} label="Total de Horas de Cursos" />
                </div>
            </aside>
        </div>
    );
};
