

import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { Course, Lesson, Content, Question } from '../../types';

const QuizViewer: React.FC<{ content: Content }> = ({ content }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerText, setAnswerText] = useState('');
    const questions = content.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        // Reset question index if content changes
        setCurrentQuestionIndex(0);
        setAnswerText('');
    }, [content]);

    if (!currentQuestion) {
        return <div className="p-4 text-center text-sm text-gray-500">Este quiz ainda não tem perguntas.</div>;
    }

    const goToNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAnswerText('');
        }
    };

    const goToPrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setAnswerText('');
        }
    };

    const renderNPSOptions = (scale: '1-5' | '1-10' = '1-10') => {
        const max = scale === '1-5' ? 5 : 10;
        const numbers = Array.from({ length: max }, (_, i) => i + 1);

        return (
            <div className="flex flex-wrap gap-2 justify-center">
                {numbers.map(num => (
                    <button
                        key={num}
                        className="w-10 h-10 border border-gray-300 rounded-md hover:bg-purple-100 hover:border-purple-400 hover:text-purple-700 transition-colors focus:ring-2 focus:ring-purple-500 font-medium text-gray-700"
                    >
                        {num}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
             <div className="flex justify-end items-center mb-4">
                 <p className="text-sm text-gray-500 font-medium">
                     Questão {currentQuestionIndex + 1} de {questions.length}
                 </p>
             </div>

            <div className="mb-6 min-h-[40px]">
                <p className="text-gray-700">{currentQuestion.text}</p>
            </div>

            {currentQuestion.questionType === 'multipleChoice' && (
                <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                        <div key={option.id} className="p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                           <p className="text-sm text-gray-700">{option.text}</p>
                        </div>
                    ))}
                </div>
            )}
            
            {currentQuestion.questionType === 'nps' && (
                <div className="py-4">
                    {renderNPSOptions(currentQuestion.npsScale)}
                    <div className="flex justify-between mt-2 text-xs text-gray-500 px-1">
                        <span>Discordo Totalmente</span>
                        <span>Concordo Totalmente</span>
                    </div>
                </div>
            )}

            {currentQuestion.questionType === 'openText' && (
                <div className="relative">
                    <textarea
                        rows={4}
                        placeholder="Digite sua resposta aqui..."
                        className="w-full p-3 border rounded-md text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                        maxLength={2000}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">
                        {answerText.length}/2000
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mt-6">
                <button 
                    onClick={goToPrevious} 
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md disabled:opacity-50"
                >
                    Anterior
                </button>
                 <button 
                    className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md"
                >
                    Responder
                </button>
                <button 
                    onClick={goToNext} 
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md disabled:opacity-50"
                >
                    Próximo
                </button>
            </div>
        </div>
    );
};

interface CoursePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    course?: Course | null;
    lessons?: Lesson[];
}

// Mock course data for preview from the list page, as `Course` type doesn't have lessons.
const MOCK_LESSONS: Lesson[] = [
    {
        id: 'mock-lesson-1',
        name: 'Lição Introdutória',
        contents: [
            { id: 'mock-content-1', type: 'image', name: 'Bem-vindo ao Curso!', uploadDate: '10 de Nov de 2025', deliveryDelay: 'Imediato', deliveryPeriod: 'Manhã' },
            { 
                id: 'mock-content-2', 
                type: 'quiz', 
                name: 'Quiz de Aquecimento', 
                quizType: 'evaluation',
                uploadDate: '11 de Nov de 2025', 
                deliveryDelay: '1 dia após a matrícula', 
                deliveryPeriod: 'Tarde',
                questions: [
                    { id: 'q1', text: 'Qual é o principal tópico deste curso?', questionType: 'multipleChoice', options: [{id: 'o1', text: 'Tópico A', isCorrect: true}, {id: 'o2', text: 'Tópico B', isCorrect: false}] },
                    { id: 'q2', text: 'O que você espera aprender?', questionType: 'openText', options: [] },
                ]
            }
        ]
    }
];

export const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({ isOpen, onClose, course, lessons: propLessons }) => {
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    
    const lessonsToDisplay = propLessons || (course ? MOCK_LESSONS : []);
    
    useEffect(() => {
        if (isOpen) {
            const allContents = lessonsToDisplay.flatMap(l => l.contents);
            const isCurrentSelectionValid = selectedContent && allContents.some(c => c.id === selectedContent.id);

            if (!isCurrentSelectionValid && allContents.length > 0) {
                setSelectedContent(allContents[0]);
            }
        } else {
            setSelectedContent(null);
        }
    }, [isOpen, lessonsToDisplay, selectedContent]);

    if (!isOpen) return null;

    const renderContentPreview = (content: Content | null) => {
        if (!content) {
            return <p className="text-center text-gray-500 mt-8">Selecione um conteúdo para visualizar.</p>;
        }
        if (content.type === 'quiz') {
            return <QuizViewer content={content} />;
        }
        // Placeholder for other content types
        return (
            <div className="flex flex-col items-center justify-center gap-4 p-8 border rounded-lg bg-white shadow-sm text-center h-full">
                <Icon name={
                    content.type === 'image' ? 'image' :
                    content.type === 'video' ? 'movie' :
                    content.type === 'pdf' ? 'picture_as_pdf' : 'link'
                } size="lg" className="text-gray-400" />
                <p className="text-sm text-gray-500">Visualização de conteúdo do tipo '{content.type}'.</p>
            </div>
        );
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-6xl h-[90vh] max-h-[800px] rounded-2xl shadow-2xl flex overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Left Panel: Navigation */}
                <aside className="w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Conteúdo do Curso</h3>
                        <p className="text-sm text-gray-500">Selecione um item para visualizar</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {lessonsToDisplay.length === 0 && (
                            <p className="text-center text-gray-500 p-4">Nenhum conteúdo adicionado ainda.</p>
                        )}
                        {lessonsToDisplay.map(lesson => (
                            <div key={lesson.id} className="py-2">
                                <h4 className="font-semibold text-sm px-2 mb-2 text-gray-800">{lesson.name}</h4>
                                <ul className="space-y-1">
                                    {lesson.contents.map(content => (
                                        <li key={content.id}>
                                            <button
                                                onClick={() => setSelectedContent(content)}
                                                className={`w-full text-left flex items-start gap-3 p-2 rounded-md transition-colors ${selectedContent?.id === content.id ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                                            >
                                                <Icon name={
                                                    content.type === 'quiz' ? 'quiz' :
                                                    content.type === 'image' ? 'image' :
                                                    content.type === 'video' ? 'movie' :
                                                    content.type === 'pdf' ? 'picture_as_pdf' : 'link'
                                                } className={`flex-shrink-0 mt-1 ${selectedContent?.id === content.id ? 'text-purple-600' : 'text-gray-500'}`} size="sm" />
                                                <div className="flex-1 overflow-hidden">
                                                    <p className={`text-sm font-medium truncate ${selectedContent?.id === content.id ? 'text-purple-800' : 'text-gray-700'}`}>{content.name}</p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{content.deliveryPeriod} - {content.deliveryDelay}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </aside>
                
                {/* Right Panel: Mobile Mockup */}
                <main className="w-2/3 flex items-center justify-center bg-gray-50 p-4">
                     <div 
                        className="bg-gray-200 w-full max-w-[375px] h-full max-h-[750px] rounded-[40px] shadow-2xl p-4 flex flex-col"
                    >
                        {/* Notch */}
                        <div className="bg-gray-800 w-32 h-6 rounded-b-xl mx-auto mb-2 flex-shrink-0"></div>
                        
                        <div className="bg-white flex-1 rounded-[20px] flex flex-col overflow-hidden">
                            {/* App Header */}
                             <header 
                                className="flex-shrink-0 flex items-center justify-between p-2.5 bg-[#ededed] rounded-b-lg"
                            >
                                 <button
                                    className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-opacity hover:opacity-80"
                                 >
                                     <Icon name="arrow_back" size="sm" />
                                     Retornar
                                 </button>
                                 <button 
                                     className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-opacity hover:opacity-80"
                                >
                                     Suporte
                                     <Icon name="chat" size="sm" />
                                 </button>
                            </header>

                            {/* Conditional Separator for Podcast */}
                            {selectedContent?.type === 'podcast' && <div className="h-[200px] flex-shrink-0"></div>}
                            
                            {/* Fixed Title */}
                             <div className="flex-shrink-0 text-center py-5 h-[60px] text-lg font-semibold text-gray-800 flex items-center justify-center">
                                 <h3 className="truncate">{selectedContent?.name || course?.name || "Prévia do Conteúdo"}</h3>
                             </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                               {renderContentPreview(selectedContent)}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};