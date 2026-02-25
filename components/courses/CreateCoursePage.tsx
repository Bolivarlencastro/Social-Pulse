

import React, { useState, useCallback, useMemo } from 'react';
import { Icon } from '../Icon';
import { Lesson, Content, Question, Option } from '../../types';

// --- Modal Wrapper ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string, size?: 'sm' | 'md' | 'lg' }> = 
({ isOpen, onClose, children, title, size = 'sm' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-2xl'
    };
    
    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center animate-fadeIn p-4" onClick={onClose}>
            <div className={`bg-white rounded-2xl shadow-xl p-6 w-full ${sizeClasses[size]} mx-auto text-center animate-scaleUp relative`} onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-800 mb-6 text-left">{title}</h3>
                 <button onClick={onClose} className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
                    <Icon name="close" size="sm" />
                </button>
                {children}
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-scaleUp { animation: scaleUp 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

// --- Helper Components ---
const Stepper: React.FC<{ currentStep: number; onStepClick: (step: number) => void }> = ({ currentStep, onStepClick }) => {
    const steps = ['Informações', 'Conteúdos', 'Finalização'];
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => onStepClick(stepNumber)}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-purple-600 text-white' : isActive ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {isCompleted ? <Icon name="check" size="sm"/> : stepNumber}
                                </div>
                                <p className={`mt-2 text-xs font-medium transition-colors ${isActive || isCompleted ? 'text-purple-700' : 'text-gray-500'}`}>{label}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-4 transition-colors ${isCompleted ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const FormInput: React.FC<{ label: string; id: string; type?: string; placeholder?: string; maxLength?: number; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; children?: React.ReactNode }> =
    ({ label, id, type = "text", maxLength, value, onChange, required, children }) => (
    <div className="relative">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
        <div className="relative">
            {children}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                required={required}
            />
        </div>
        {maxLength && <p className="text-right text-xs text-gray-500 mt-1">{value.length}/{maxLength}</p>}
    </div>
);

const FormSelect: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode; icon: string; required?: boolean }> =
    ({ label, id, value, onChange, children, icon, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
        <div className="relative">
            <Icon name={icon} size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
            <select id={id} value={value} onChange={onChange} className="w-full p-3 pl-10 border border-gray-300 rounded-md appearance-none focus:ring-purple-500 focus:border-purple-500">
                {children}
            </select>
            <Icon name="expand_more" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
        </div>
    </div>
);

const FormTextarea: React.FC<{ label: string; id: string; maxLength?: number; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean }> =
 ({ label, id, maxLength, value, onChange, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        ></textarea>
        {maxLength && <p className="text-right text-xs text-gray-500 mt-1">{value.length}/{maxLength}</p>}
    </div>
);


const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button
            onClick={() => setEnabled(!enabled)}
            className={`${enabled ? 'bg-purple-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);


// --- Step Components ---

const Step1: React.FC<{ onNext: () => void, onBack: () => void }> = ({ onNext, onBack }) => {
    const [formData, setFormData] = useState({ name: '', category: '', language: '', description: '' });
    const [toggles, setToggles] = useState({ active: true, allowQuit: true, allowSkip: true, disableCert: false });
    const [isFormValid, setIsFormValid] = useState(false);

     React.useEffect(() => {
        const { name, category, language, description } = formData;
        setIsFormValid(!!(name && category && language && description));
    }, [formData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center text-gray-500 h-64">
                <Icon name="satellite_alt" size="lg" className="text-gray-400 mb-4"/>
                <button className="bg-white h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
                    <Icon name="upload" size="sm"/>
                    Selecione ou arraste uma imagem
                </button>
            </div>

            <div className="space-y-4">
                <FormInput label="Nome do Curso" id="name" value={formData.name} onChange={handleChange} maxLength={100} required />
                 <FormSelect label="Categoria" id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} icon="sell" required>
                    <option value="">Selecione uma categoria</option>
                    <option value="tech">Tecnologia</option>
                    <option value="design">Design</option>
                </FormSelect>
                <FormSelect label="Linguagem" id="language" value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})} icon="translate" required>
                    <option value="">Selecione uma linguagem</option>
                    <option value="pt-br">Português (Brasil)</option>
                    <option value="en-us">Inglês (EUA)</option>
                </FormSelect>
                <FormTextarea label="Descrição" id="description" value={formData.description} onChange={handleChange} maxLength={200} required />
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-800">Cálculo de desempenho</h3>
                    <p className="text-sm text-gray-600">Ajuste a importância dos Conteúdos e Questionário na avaliação da performance. O ajuste dos sliders define pesos que influenciam diretamente a nota final dos usuários!</p>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium">Conteúdo:</label>
                        <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Questionário:</label>
                        <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-800">Ajustes Extras</h3>
                    <p className="text-sm text-gray-600">Personalize a experiência do curso com opções de navegação, desistência e certificação.</p>
                </div>
                <div className="space-y-4">
                    <ToggleSwitch label="Curso ativo?" enabled={toggles.active} setEnabled={(val) => setToggles({...toggles, active: val})} />
                    <ToggleSwitch label="Permitir desistência?" enabled={toggles.allowQuit} setEnabled={(val) => setToggles({...toggles, allowQuit: val})} />
                    <ToggleSwitch label="Permitir avançar conteúdo?" enabled={toggles.allowSkip} setEnabled={(val) => setToggles({...toggles, allowSkip: val})} />
                    <ToggleSwitch label="Desativar envio do certificado?" enabled={toggles.disableCert} setEnabled={(val) => setToggles({...toggles, disableCert: val})} />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onBack} className="h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Cancelar</button>
                <button 
                  onClick={onNext} 
                  className={`h-12 px-6 rounded-full text-sm font-semibold text-white transition-colors flex items-center justify-center ${isFormValid ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={!isFormValid}
                >
                  Salvar e Avançar
                </button>
            </div>
        </div>
    )
};

const Step2: React.FC<{ lessons: Lesson[], onAddLesson: (name: string) => void, onOpenContentModal: (lessonId: string) => void, onOpenQuestionModal: (content: Content) => void, onNext: () => void, onBack: () => void }> = 
({ lessons, onAddLesson, onOpenContentModal, onOpenQuestionModal, onNext, onBack }) => {
    const [newLessonName, setNewLessonName] = useState('');
    const [openLessonId, setOpenLessonId] = useState<string | null>(null);

    const handleAddLesson = () => {
        if (newLessonName.trim()) {
            const newId = `lesson-${Date.now()}`;
            onAddLesson(newLessonName.trim());
            setNewLessonName('');
            setOpenLessonId(newId); // Open the newly created lesson
        }
    };
    
    React.useEffect(() => {
        if (lessons.length > 0 && !openLessonId) {
            setOpenLessonId(lessons[0].id);
        }
    }, [lessons, openLessonId]);

    const renderContent = (content: Content) => {
        switch (content.type) {
            case 'quiz':
                return (
                    <div className="p-4 bg-gray-50 rounded-md border">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Icon name={content.quizType === 'survey' ? 'poll' : 'quiz'} className="text-gray-500" />
                                <div>
                                    <p className="font-medium text-sm">{content.name}</p>
                                    <p className="text-xs text-gray-500">{content.uploadDate}</p>
                                </div>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                    {content.quizType === 'survey' ? 'Pesquisa' : 'Avaliativo'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onOpenQuestionModal(content)} className="h-12 px-4 text-sm font-semibold border border-gray-300 rounded-full hover:bg-gray-100 flex items-center gap-1">
                                    <Icon name="add" size="sm"/> Pergunta
                                </button>
                                <select defaultValue={content.deliveryDelay} className="bg-white border border-gray-300 rounded-md h-12 px-4 text-sm">
                                    <option>1 dia após a...</option>
                                    <option>2 dias após a...</option>
                                </select>
                                <select defaultValue={content.deliveryPeriod} className="bg-white border border-gray-300 rounded-md h-12 px-4 text-sm">
                                    <option>Manhã</option>
                                    <option>Tarde</option>
                                    <option>Noite</option>
                                </select>
                                <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="edit" size="sm"/></button>
                                <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="delete" size="sm"/></button>
                            </div>
                        </div>
                        <div className="mt-4 pl-8 space-y-2">
                            {content.questions && content.questions.length > 0 ? (
                                content.questions.map((q, index) => (
                                    <div key={q.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <Icon 
                                                name={q.questionType === 'openText' ? 'notes' : q.questionType === 'nps' ? 'speed' : 'rule'} 
                                                size="sm" 
                                                className="text-gray-400" 
                                            />
                                            <p><span className="font-semibold">{index + 1}.</span> {q.text}</p>
                                        </div>
                                        <div>
                                            <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="edit" size="sm"/></button>
                                            <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="delete" size="sm"/></button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 text-center py-2">Cadastre a sua primeira pergunta</p>
                            )}
                        </div>
                    </div>
                );
            default: // image, video, etc.
                return (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <div className="flex items-center gap-3">
                            <Icon name="image" className="text-gray-400" />
                            <div>
                                <p className="font-medium text-sm">{content.name}</p>
                                <p className="text-xs text-gray-500">{content.uploadDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <select defaultValue={content.deliveryDelay} className="bg-white border border-gray-300 rounded-md h-12 px-4 text-sm">
                                <option>1 dia após a...</option>
                                <option>2 dias após a...</option>
                            </select>
                            <select defaultValue={content.deliveryPeriod} className="bg-white border border-gray-300 rounded-md h-12 px-4 text-sm">
                                <option>Manhã</option>
                                <option>Tarde</option>
                                <option>Noite</option>
                            </select>
                            <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="edit" size="sm"/></button>
                            <button className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 rounded-full"><Icon name="delete" size="sm"/></button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Conteúdos</h2>
            <div className="space-y-4">
                 <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Nome da Lição" 
                      value={newLessonName}
                      onChange={(e) => setNewLessonName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddLesson()}
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"/>
                    <button onClick={handleAddLesson} className="w-12 h-12 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-300"><Icon name="add"/></button>
                 </div>
                 
                 {lessons.map(lesson => (
                     <div key={lesson.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4 flex justify-between items-center cursor-pointer bg-white" onClick={() => setOpenLessonId(prev => prev === lesson.id ? null : lesson.id)}>
                            <span className="font-semibold">{lesson.name}</span>
                            <Icon name={openLessonId === lesson.id ? "expand_less" : "expand_more"} />
                        </div>
                        {openLessonId === lesson.id && (
                             <div className="p-4 border-t border-gray-200">
                                {lesson.contents.length === 0 ? (
                                    <div className="text-center text-gray-500 py-4">Esta lição ainda não possui conteúdos.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {lesson.contents.map(content => (
                                             <React.Fragment key={content.id}>{renderContent(content)}</React.Fragment>
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-end mt-4">
                                    <button onClick={() => onOpenContentModal(lesson.id)} className="bg-white border border-gray-300 h-12 px-6 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
                                        Novo Conteúdo
                                        <Icon name="expand_more" size="sm"/>
                                    </button>
                                </div>
                            </div>
                        )}
                     </div>
                 ))}

            </div>
            <div className="flex justify-end items-center gap-3 pt-8 mt-4 border-t">
                <button onClick={onBack} className="h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                <button onClick={onNext} className="h-12 px-6 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 flex items-center justify-center">Revisar e Publicar</button>
            </div>
        </div>
    )
};

const Step3: React.FC<{ lessons: Lesson[], onPublish: () => void, onBack: () => void }> = ({ lessons, onPublish, onBack }) => {
     return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-lg font-semibold mb-6 text-gray-800">Timeline do Curso</h2>
            <div className="relative border-l-2 border-gray-200 ml-4 pl-8 py-2">
                {lessons.length === 0 && <p className="text-center text-gray-500">Nenhum conteúdo adicionado ainda.</p>}
                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="mb-6 relative">
                         <div className="absolute -left-[34px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Icon name="edit_note" className="text-purple-600"/>
                                <p className="font-semibold text-gray-800">{lesson.name}</p>
                            </div>
                            {lesson.contents.map(content => (
                                <div key={content.id} className="mt-4 ml-8 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Icon name={content.type === 'quiz' ? 'quiz' : 'image'} className="text-gray-500 mt-1"/>
                                        <div>
                                            <p className="font-medium text-gray-700">{content.name}</p>
                                            <p className="text-xs text-gray-500">{content.uploadDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Icon name="schedule" size="sm"/>
                                        <span>{content.deliveryPeriod} - {content.deliveryDelay}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end items-center gap-3 pt-8 mt-8 border-t">
                <button onClick={onBack} className="h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                <button onClick={onPublish} className="h-12 px-6 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 flex items-center justify-center">Publicar o Curso</button>
            </div>
        </div>
    )
};

// --- Main Component ---
export const CreateCoursePage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [step, setStep] = useState(2);
  const [lessons, setLessons] = useState<Lesson[]>([
      { id: 'lesson-1', name: 'Lição 1', contents: [] }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal State
  const [modalStep, setModalStep] = useState<'type' | 'archiveType' | 'upload' | 'quizType' | 'quizName' | 'addQuestion'>('type');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  
  // Content State
  const [uploadContentName, setUploadContentName] = useState('');
  const [quizName, setQuizName] = useState('');
  const [newQuizType, setNewQuizType] = useState<'evaluation' | 'survey' | null>(null);
  
  // Question State
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const initialQuestionState: Question = useMemo(() => ({
    id: '',
    text: '',
    questionType: 'multipleChoice',
    npsScale: '1-10',
    options: [
        { id: `opt-1`, text: '', isCorrect: false },
        { id: `opt-2`, text: '', isCorrect: false }
    ]
  }), []);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestionState);
  const [questionError, setQuestionError] = useState<string | null>(null);
  
  const handleAddLesson = (name: string) => {
      const newLesson: Lesson = { id: `lesson-${Date.now()}`, name, contents: [] };
      setLessons(prev => [...prev, newLesson]);
  };
  
  const handleOpenContentModal = (lessonId: string) => {
      setCurrentLessonId(lessonId);
      setModalStep('type');
      setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsModalOpen(false);
      setUploadContentName('');
      setQuizName('');
      setCurrentLessonId(null);
      setEditingContent(null);
      setCurrentQuestion(initialQuestionState);
      setQuestionError(null);
      setNewQuizType(null);
  };
  
  const handleSaveContent = () => {
    if (!currentLessonId || !uploadContentName.trim()) return;
    setIsLoading(true);
    handleCloseModal();
    setTimeout(() => {
        const newContent: Content = {
            id: `content-${Date.now()}`, type: 'image', name: uploadContentName.trim(),
            uploadDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'}),
            deliveryDelay: '1 dia após a matrícula', deliveryPeriod: 'Manhã'
        };
        setLessons(prev => prev.map(lesson => 
            lesson.id === currentLessonId ? { ...lesson, contents: [...lesson.contents, newContent] } : lesson
        ));
        setIsLoading(false);
    }, 1500);
  };

  const handleSaveQuiz = () => {
    if (!currentLessonId || !quizName.trim() || !newQuizType) return;
    const newQuiz: Content = {
        id: `quiz-${Date.now()}`, type: 'quiz', name: quizName.trim(),
        quizType: newQuizType,
        uploadDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric'}),
        deliveryDelay: '1 dia após a matrícula', deliveryPeriod: 'Manhã', questions: []
    };
    setLessons(prev => prev.map(lesson => 
        lesson.id === currentLessonId ? { ...lesson, contents: [...lesson.contents, newQuiz] } : lesson
    ));
    handleCloseModal();
  };
  
  const handleOpenQuestionModal = (content: Content) => {
    setEditingContent(content);
    setCurrentQuestion(initialQuestionState); // Reset to default when opening
    setModalStep('addQuestion');
    setIsModalOpen(true);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion(prev => ({...prev, text: e.target.value }));
  };
  
  const handleQuestionTypeChange = (type: 'multipleChoice' | 'openText' | 'nps') => {
      setCurrentQuestion(prev => ({ ...prev, questionType: type }));
  }

  const handleOptionChange = (optionId: string, text: string) => {
    setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.map(opt => opt.id === optionId ? {...opt, text} : opt)
    }));
  };

  const handleSelectCorrectOption = (optionId: string) => {
    setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.map(opt => ({...opt, isCorrect: opt.id === optionId }))
    }));
  };

  const handleAddOption = () => {
    if (currentQuestion.options.length < 5) {
        setCurrentQuestion(prev => ({
            ...prev,
            options: [...prev.options, { id: `opt-${Date.now()}`, text: '', isCorrect: false}]
        }));
    }
  };

  const handleSaveQuestion = () => {
      setQuestionError(null);
      if (!editingContent) return;

      // Validation
      if (!currentQuestion.text.trim()) {
          setQuestionError("Descreva a questão.");
          return;
      }
      
      if (currentQuestion.questionType === 'multipleChoice') {
        const filledOptions = currentQuestion.options.filter(opt => opt.text.trim() !== '');
        if (filledOptions.length < 2) {
            setQuestionError("A questão deve ter pelo menos 2 opções preenchidas.");
            return;
        }
        if (editingContent.quizType === 'evaluation' && !currentQuestion.options.some(opt => opt.isCorrect)) {
            setQuestionError("Selecione a opção correta para um quiz avaliativo.");
            return;
        }
      }

      const newQuestion: Question = { ...currentQuestion, id: `question-${Date.now()}`};
      setLessons(prev => prev.map(lesson => ({
          ...lesson,
          contents: lesson.contents.map(content => 
              content.id === editingContent.id 
                ? { ...content, questions: [...(content.questions || []), newQuestion] } 
                : content
          )
      })));
      handleCloseModal();
  };
  
  const renderModals = () => {
      switch(modalStep) {
          case 'type': return (
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Subir Conteúdo">
                <div className="grid grid-cols-3 gap-4">
                    <button onClick={() => setModalStep('archiveType')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100 aspect-square justify-center">
                        <Icon name="upload_file" size="lg" />
                        <span className="text-sm font-semibold mt-2">Arquivo</span>
                    </button>
                    <button className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100 aspect-square justify-center">
                        <Icon name="link" size="lg" />
                        <span className="text-sm font-semibold mt-2">Link</span>
                    </button>
                     <button onClick={() => setModalStep('quizType')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100 aspect-square justify-center">
                        <Icon name="quiz" size="lg" />
                        <span className="text-sm font-semibold mt-2">Quiz</span>
                    </button>
                </div>
            </Modal>
          );
          case 'archiveType': return (
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Subir Conteúdo (Arquivo)">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setModalStep('upload')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100">
                        <Icon name="movie" size="lg" /> <span className="text-sm font-semibold mt-2">Vídeo</span>
                    </button>
                    <button onClick={() => setModalStep('upload')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100">
                        <Icon name="image" size="lg" /> <span className="text-sm font-semibold mt-2">Imagem</span>
                    </button>
                     <button onClick={() => setModalStep('upload')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100">
                        <Icon name="mic" size="lg" /> <span className="text-sm font-semibold mt-2">Podcast</span>
                    </button>
                     <button onClick={() => setModalStep('upload')} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100">
                        <Icon name="picture_as_pdf" size="lg" /> <span className="text-sm font-semibold mt-2">PDF</span>
                    </button>
                </div>
                <div className="mt-6">
                    <button onClick={() => setModalStep('type')} className="h-12 w-full px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                </div>
            </Modal>
          );
          case 'upload': return (
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Subir Conteúdo (Arquivo)">
                <div className="space-y-4 text-left">
                    <div className="flex flex-col items-center gap-2">
                         <div className="w-24 h-24 bg-purple-100/50 text-purple-500 rounded-lg flex items-center justify-center">
                            <Icon name="image" size="lg"/>
                        </div>
                        <span className="text-sm font-semibold">Imagem de capa</span>
                    </div>
                     <div>
                        <label htmlFor="contentName" className="block text-sm font-medium text-gray-700 mb-1">Nome do conteúdo *</label>
                        <input type="text" id="contentName" value={uploadContentName} onChange={(e) => setUploadContentName(e.target.value)} placeholder="Captura de tela 2025-10-01..." className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                     </div>
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={() => setModalStep('archiveType')} className="flex-1 h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                    <button onClick={handleSaveContent} className="flex-1 h-12 px-6 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-300 flex items-center justify-center" disabled={!uploadContentName.trim()}>Salvar</button>
                </div>
            </Modal>
          );
          case 'quizType': return (
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Selecione o Tipo de Quiz">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => { setNewQuizType('evaluation'); setModalStep('quizName'); }} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100 aspect-square justify-center">
                        <Icon name="quiz" size="lg" />
                        <span className="text-sm font-semibold mt-2">Avaliativo</span>
                        <span className="text-xs text-gray-500 mt-1">Para validar conhecimento.</span>
                    </button>
                    <button onClick={() => { setNewQuizType('survey'); setModalStep('quizName'); }} className="flex flex-col items-center p-4 bg-purple-100/50 text-purple-700 rounded-lg hover:bg-purple-100 aspect-square justify-center">
                        <Icon name="poll" size="lg" />
                        <span className="text-sm font-semibold mt-2">Pesquisa</span>
                         <span className="text-xs text-gray-500 mt-1">Para coletar opiniões.</span>
                    </button>
                </div>
                 <div className="mt-6">
                    <button onClick={() => setModalStep('type')} className="h-12 w-full px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                </div>
             </Modal>
          );
          case 'quizName': return (
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={`Novo Quiz (${newQuizType === 'survey' ? 'Pesquisa' : 'Avaliativo'})`}>
                <div className="space-y-4 text-left">
                     <div>
                        <label htmlFor="quizName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Quiz *</label>
                        <input type="text" id="quizName" value={quizName} onChange={(e) => setQuizName(e.target.value)} placeholder="Ex: Quiz de Boas Vindas" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                     </div>
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={() => setModalStep('quizType')} className="flex-1 h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Voltar</button>
                    <button onClick={handleSaveQuiz} className="flex-1 h-12 px-6 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 disabled:bg-gray-300 flex items-center justify-center" disabled={!quizName.trim()}>Salvar</button>
                </div>
            </Modal>
          );
          case 'addQuestion': return (
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Nova Questão" size="lg">
                <div className="space-y-4 text-left">
                    {editingContent?.quizType === 'survey' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo da Pergunta</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="questionType" checked={currentQuestion.questionType === 'multipleChoice'} onChange={() => handleQuestionTypeChange('multipleChoice')} className="accent-purple-600" />
                                    Múltipla Escolha
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="questionType" checked={currentQuestion.questionType === 'openText'} onChange={() => handleQuestionTypeChange('openText')} className="accent-purple-600" />
                                    Texto Aberto
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="questionType" checked={currentQuestion.questionType === 'nps'} onChange={() => handleQuestionTypeChange('nps')} className="accent-purple-600" />
                                    NPS
                                </label>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descreva a questão *</label>
                        <input type="text" value={currentQuestion.text} onChange={handleQuestionChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                    </div>

                    {currentQuestion.questionType === 'nps' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Escala do NPS</label>
                            <select 
                                value={currentQuestion.npsScale || '1-10'} 
                                onChange={(e) => setCurrentQuestion({...currentQuestion, npsScale: e.target.value as '1-5' | '1-10'})}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 bg-white"
                            >
                                <option value="1-5">Escala de 1 a 5</option>
                                <option value="1-10">Escala de 1 a 10</option>
                            </select>
                        </div>
                    )}

                    {currentQuestion.questionType === 'multipleChoice' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700 -mb-1">Opções de Resposta</label>
                            {currentQuestion.options.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-3">
                                    {editingContent?.quizType === 'evaluation' && (
                                        <button onClick={() => handleSelectCorrectOption(option.id)}>
                                            <Icon name={option.isCorrect ? "check_box" : "check_box_outline_blank"} className={`cursor-pointer ${option.isCorrect ? 'text-purple-600' : 'text-gray-400'}`} />
                                        </button>
                                    )}
                                    <input type="text" placeholder={`Descreva a ${index+1}ª opção *`} value={option.text} onChange={(e) => handleOptionChange(option.id, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" />
                                    <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={currentQuestion.options.length <= 2}>
                                        <Icon name="delete" size="sm"/>
                                    </button>
                                </div>
                            ))}
                             <button onClick={handleAddOption} className="text-sm font-semibold text-purple-600 hover:underline" disabled={currentQuestion.options.length >= 5}>
                                Adicionar Opção
                            </button>
                        </div>
                    )}
                    
                    {questionError && (
                        <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
                           <Icon name="warning" size="sm" /> {questionError}
                        </div>
                    )}
                </div>
                 <div className="mt-8 flex justify-end gap-3">
                    <button onClick={handleCloseModal} className="h-12 px-6 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center justify-center">Cancelar</button>
                    <button onClick={handleSaveQuestion} className="h-12 px-6 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 flex items-center justify-center">Salvar</button>
                </div>
            </Modal>
          );
          default: return null;
      }
  }
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 onNext={() => setStep(2)} onBack={onBack} />;
      case 2:
        return <Step2 lessons={lessons} onAddLesson={handleAddLesson} onOpenContentModal={handleOpenContentModal} onOpenQuestionModal={handleOpenQuestionModal} onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3:
        return <Step3 lessons={lessons} onPublish={() => { alert('Curso publicado com sucesso!'); onBack(); }} onBack={() => setStep(2)} />;
      default:
        return <Step1 onNext={() => setStep(2)} onBack={onBack} />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col bg-[#fdfcff]">
        <Stepper currentStep={step} onStepClick={setStep} />
        <div className="flex-1 mt-8 overflow-y-auto">
            {renderStep()}
        </div>
        {renderModals()}
        {isLoading && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg text-sm font-semibold z-50">
                Carregando...
            </div>
        )}
    </div>
  );
};