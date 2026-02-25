import React, { useState, useMemo } from 'react';
import { Icon } from '../Icon';
import { COURSES } from '../../constants';
import { Course } from '../../types';
import { Pagination } from './Pagination';
import { SummaryPanel } from './SummaryPanel';
import { CoursePreviewModal } from './CoursePreviewModal';

const CourseRow: React.FC<{ course: Course; onPreview: (course: Course) => void }> = ({ course, onPreview }) => {
    const statusClasses = course.status === 'Publicado' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    const statusDotClasses = course.status === 'Publicado' ? 'bg-green-500' : 'bg-red-500';

    const renderThumbnail = () => {
        if (course.thumbnailUrl === 'icon') {
            return <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-md"><Icon name="code" /></div>;
        }
        if (course.thumbnailUrl === 'logo') {
             return <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-md font-bold text-xs">KEEPS</div>;
        }
        if (course.thumbnailUrl) {
            return <img src={course.thumbnailUrl} alt={course.name} className="w-10 h-10 object-cover rounded-md" />;
        }
        return <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md text-gray-400"><Icon name="photo_camera" size="sm" /></div>;
    }

    return (
        <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    {renderThumbnail()}
                    <span>{course.name}</span>
                </div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.owner}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.category}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.creationDate}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.duration}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.enrolled}</td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{course.finished}</td>
            <td className="px-4 py-3 text-sm whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusClasses}`}>
                    <span className={`w-2 h-2 rounded-full ${statusDotClasses}`}></span>
                    {course.status}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
                <button 
                    onClick={() => onPreview(course)}
                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-200"
                    aria-label="Visualizar curso"
                >
                    <Icon name="visibility" size="sm" />
                </button>
            </td>
        </tr>
    );
};

interface CoursesPageProps {
    onCreateCourse: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onCreateCourse }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isSummaryPanelOpen, setSummaryPanelOpen] = useState(false);
    const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

    const paginatedCourses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return COURSES.slice(startIndex, endIndex);
    }, [currentPage, itemsPerPage]);
    
    const totalPages = Math.ceil(COURSES.length / itemsPerPage);

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={onCreateCourse}
                            className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-2 h-12">
                            <Icon name="add" filled />
                            <span>Criar</span>
                        </button>
                         <button 
                            onClick={() => setSummaryPanelOpen(true)}
                            className="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 border border-gray-300 hover:bg-gray-100 transition-colors">
                            <Icon name="table_chart" />
                        </button>
                    </div>
                </div>

                {/* Filter/Search Bar */}
                <div className="flex items-center gap-4 mb-4">
                    <button className="flex items-center gap-2 px-4 h-12 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50">
                        <Icon name="filter_list" size="sm" />
                        <span>Filtros</span>
                    </button>
                    <div className="relative flex-1">
                        <Icon name="search" size="sm" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar por..."
                            className="w-full h-12 pl-12 pr-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Courses Table */}
                <div className="flex-1 overflow-hidden bg-white rounded-lg border border-gray-200 flex flex-col">
                     <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Nome', 'Proprietário', 'Categoria', 'Criação', 'Duração', 'Inscritos', 'Final.', 'Status', 'Ações'].map(header => (
                                        <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedCourses.map(course => <CourseRow key={course.id} course={course} onPreview={setPreviewCourse} />)}
                            </tbody>
                        </table>
                     </div>
                </div>
                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={COURSES.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(num) => { setItemsPerPage(num); setCurrentPage(1);}}
                />
            </div>
            <SummaryPanel
                isOpen={isSummaryPanelOpen}
                onClose={() => setSummaryPanelOpen(false)}
                courses={COURSES}
            />
            <CoursePreviewModal 
                isOpen={!!previewCourse}
                onClose={() => setPreviewCourse(null)}
                course={previewCourse}
            />
        </>
    );
};
