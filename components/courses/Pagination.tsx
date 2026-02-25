import React from 'react';
import { Icon } from '../Icon';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const PageButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, children }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
    >
        {children}
    </button>
);


export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) => {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between py-3 px-4 border-t border-gray-200 bg-white rounded-b-lg mt-[-1px] text-sm">
            <div className="flex items-center gap-2 text-gray-600">
                <span>Itens por página</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="h-12 px-4 bg-white border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                >
                    {[10, 20, 50, 100].map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
                <span>{startItem} - {endItem} de {totalItems}</span>
                <div className="flex items-center gap-1">
                    <PageButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                        <Icon name="first_page" size="sm" />
                    </PageButton>
                    <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        <Icon name="chevron_left" size="sm" />
                    </PageButton>
                    <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        <Icon name="chevron_right" size="sm" />
                    </PageButton>
                    <PageButton onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                        <Icon name="last_page" size="sm" />
                    </PageButton>
                </div>
            </div>
        </div>
    );
};
