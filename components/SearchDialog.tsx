import React, { useEffect } from 'react';
import { Icon } from './Icon';

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 transition-opacity animate-fadeIn"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div className="absolute top-4 right-4">
                <button
                    onClick={onClose}
                    className="w-12 h-12 flex items-center justify-center rounded-full text-gray-200 hover:bg-white/20 transition-colors"
                    aria-label="Close search"
                >
                    <Icon name="close" />
                </button>
            </div>
            <div 
                className="flex justify-center pt-20 sm:pt-24"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
            >
                <div className="w-full max-w-2xl px-4">
                    <div className="relative">
                        <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size="md" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Buscar cursos, trilhas, eventos..."
                            className="w-full h-16 pl-16 pr-6 text-lg bg-white text-gray-800 rounded-lg shadow-lg border border-transparent focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        />
                    </div>
                    <p className="text-center mt-6 text-gray-200">Os resultados da busca aparecerão aqui.</p>
                </div>
            </div>
             <style>{`
                @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};
