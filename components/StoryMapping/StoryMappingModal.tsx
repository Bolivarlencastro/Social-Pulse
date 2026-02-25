import React, { useEffect, useState } from 'react';
import { Icon } from '../Icon';
import { StoryMapData, Story, Link } from './types';

interface StoryMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StoryMapData | null;
  onInternalLinkClick?: (target: string) => void;
}

const StoryCard: React.FC<{ story: Story; onLinkClick?: (link: Link) => void }> = ({ story, onLinkClick }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-2 hover:shadow-md transition-shadow">
      <h4 className="font-bold text-sm text-gray-800 mb-2">{story.title}</h4>
      {story.details.length > 0 && (
        <ul className="space-y-1.5">
          {story.details.map((detail, idx) => (
            <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
              <Icon 
                name={detail.checked ? "check_box" : "check_box_outline_blank"} 
                size="sm" 
                className={`flex-shrink-0 text-[16px] ${detail.checked ? 'text-green-500' : 'text-gray-400'}`} 
              />
              <span className={`flex-1 ${detail.checked ? 'line-through opacity-70' : ''}`}>
                {detail.link ? (
                  <button 
                    onClick={() => onLinkClick && onLinkClick(detail.link!)}
                    className="text-purple-600 hover:underline text-left inline-flex items-center gap-1"
                  >
                    {detail.text}
                    {detail.link.type === 'internal' && <Icon name="gps_fixed" className="text-[10px]" />}
                    {detail.link.type === 'clickup' && <Icon name="fact_check" className="text-[10px]" />}
                    {detail.link.type === 'external' && <Icon name="open_in_new" className="text-[10px]" />}
                  </button>
                ) : (
                  detail.text
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- PREVIEW COMPONENTS ---

const WhatsAppScreen: React.FC<{ type: 'survey' | 'evaluation' | 'nps'; onNextStep: () => void }> = ({ type, onNextStep }) => {
  const isEvaluation = type === 'evaluation';
  const isNPS = type === 'nps';

  return (
    <div className="bg-[#0b141a] h-full flex flex-col font-sans text-[#e9edef]">
      {/* WhatsApp Header */}
      <div className="bg-[#202c33] p-3 flex items-center gap-3 shadow-md flex-shrink-0">
         <button className="text-white"><Icon name="arrow_back" /></button>
         <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            SZ
         </div>
         <div className="flex-1">
            <h3 className="font-semibold text-sm text-white">Smartzap Bot</h3>
            <p className="text-[10px] text-gray-400">Business Account</p>
         </div>
         <Icon name="videocam" className="text-white mr-2" />
         <Icon name="call" className="text-white" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#0b141a] relative">
         {/* Background Pattern Overlay (Simulated) */}
         <div className="absolute inset-0 opacity-[0.06] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] pointer-events-none"></div>
         
         <div className="relative z-10">
            <div className="flex justify-center mb-4">
                <span className="bg-[#1f2c34] text-[#8696a0] text-[10px] px-2 py-1 rounded-lg uppercase font-medium shadow-sm">
                Hoje
                </span>
            </div>

            {/* Content Delivery Message (Common) */}
            <div className="flex flex-col items-start mb-2">
                <div className="bg-[#202c33] p-2 rounded-lg rounded-tl-none max-w-[85%] shadow-sm relative text-sm">
                <div className="flex items-start gap-2 mb-1 bg-[#1f2c34] p-1.5 rounded bg-opacity-50 border-l-4 border-[#00a884]">
                    <Icon name="article" className="text-gray-400 text-lg" />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-xs text-gray-200">Conteúdo.</p>
                        <p className="text-xs text-gray-400 truncate">[CONTENT_DESCRIPTION]</p>
                    </div>
                </div>
                <p className="text-white text-sm">Receber conteúdo</p>
                <span className="text-[10px] text-[#8696a0] absolute right-2 bottom-1 flex items-center gap-1">
                    10:42 <Icon name="done_all" className="text-[#53bdeb] text-[14px]" />
                </span>
                </div>
            </div>

            {/* Quiz/Survey Invite Message */}
            <div className="flex flex-col items-start">
                <div className="bg-[#202c33] p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm relative text-sm">
                <p className="text-[#dba642] font-semibold text-xs mb-1">🤖 Bot</p>
                <p className="mb-2">📚 Olá [USER_FIRST_NAME]!</p>
                
                {isEvaluation ? (
                    <>
                        <p className="mb-3 text-gray-300 font-medium">[QUIZ_NAME]</p>
                        <p className="mb-3 text-gray-400 text-xs">[QUIZ_DESCRIPTION]</p>
                        <p className="font-bold text-sm mb-1">👇 Responda o quiz por aqui:</p>
                    </>
                ) : isNPS ? (
                    <>
                        <p className="mb-3 text-gray-300 font-medium">[NPS_SURVEY_NAME]</p>
                        <p className="mb-3 text-gray-400 text-xs">Sua opinião é muito importante para melhorarmos.</p>
                        <p className="font-bold text-sm mb-1">👇 Responda a pesquisa NPS por aqui:</p>
                    </>
                ) : (
                    <>
                        <p className="mb-3 text-gray-300 font-medium">[QUIZ_SEARCH_NAME]</p>
                        <p className="mb-3 text-gray-400 text-xs">[QUIZ_SEARCH_DESCRIPTION]</p>
                        <p className="font-bold text-sm mb-1">👇 Responda a pesquisa por aqui:</p>
                    </>
                )}
                
                <button onClick={onNextStep} className="text-[#53bdeb] hover:underline break-all text-left block mb-2 cursor-pointer">
                    https://keeps.page.link/JN3a
                </button>
                
                <div className="mt-2 border-t border-[#2a3942] pt-2 space-y-2">
                    <button className="w-full text-center text-[#00a884] font-medium py-1 hover:bg-[#2a3942] rounded transition-colors flex items-center justify-center gap-2">
                        <Icon name="reply" className="rotate-180" size="sm"/> Receber conteúdo
                    </button>
                    <button className="w-full text-center text-[#00a884] font-medium py-1 hover:bg-[#2a3942] rounded transition-colors flex items-center justify-center gap-2">
                        <Icon name="headset_mic" size="sm"/> Suporte
                    </button>
                </div>
                
                <span className="text-[10px] text-[#8696a0] absolute right-2 bottom-2 flex items-center gap-1">
                    10:43 <Icon name="done_all" className="text-[#53bdeb] text-[14px]" />
                </span>
                </div>
            </div>
         </div>

      </div>

      {/* Footer Input */}
      <div className="bg-[#202c33] p-2 flex items-center gap-2 flex-shrink-0">
          <Icon name="mood" className="text-[#8696a0] ml-1" />
          <Icon name="add" className="text-[#8696a0]" />
          <div className="flex-1 bg-[#2a3942] rounded-full h-9 px-4 flex items-center text-[#8696a0] text-sm">
            Mensagem
          </div>
          <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center">
             <Icon name="mic" className="text-white" />
          </div>
      </div>
    </div>
  );
};

const WebSimulationScreen: React.FC<{ 
    step: 'question' | 'result'; 
    flowType: 'qualitative' | 'quantitative' | 'evaluation' | 'nps-5' | 'nps-10'; 
    onNextStep: () => void;
    onBackToWhatsapp: () => void;
}> = ({ step, flowType, onNextStep, onBackToWhatsapp }) => {
   const isEvaluation = flowType === 'evaluation';
   const isQuantitative = flowType === 'quantitative' || flowType === 'evaluation';
   const isNPS = flowType === 'nps-5' || flowType === 'nps-10';
   
   // --- RENDER: FEEDBACK / RESULT SCREEN ---
   if (step === 'result') {
       return (
           <div className={`h-full flex flex-col font-sans text-white ${isEvaluation ? 'bg-[#1e40af]' : 'bg-[#0f172a]'}`}>
               {/* Web Header */}
                <div className="h-14 flex items-center justify-between px-4 bg-white/10 flex-shrink-0 backdrop-blur-sm">
                    <button 
                    onClick={onBackToWhatsapp}
                    className="bg-[#6bb847] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90"
                    >
                    <Icon name="arrow_back" className="text-sm" /> Retornar
                    </button>
                    <button className="bg-[#6bb847] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90">
                    <Icon name="chat" className="text-sm" /> Suporte
                    </button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                    
                    {isEvaluation ? (
                        <>
                            <p className="text-lg font-bold mb-8 uppercase tracking-widest text-white/80">[QUIZ_NAME]</p>
                            
                            <div className="w-full bg-white rounded-lg text-gray-800 p-6 flex flex-col items-center shadow-lg max-w-xs">
                                <div className="text-left w-full mb-4">
                                     <div className="w-24 h-6 bg-[#1e40af] rounded mb-2"></div>
                                </div>
                                
                                <h2 className="text-[#1e40af] text-2xl font-bold mb-1">Parabéns,</h2>
                                <h3 className="text-[#1e40af] text-lg font-medium mb-6">Você finalizou o Quiz</h3>
                                
                                <div className="mb-6 relative">
                                    <Icon name="emoji_events" className="text-yellow-400 text-8xl drop-shadow-md" filled />
                                    <Icon name="star" className="text-yellow-400 absolute -top-2 -right-2 text-3xl animate-pulse" filled />
                                </div>

                                <p className="text-sm font-semibold text-[#1e40af]">
                                    Você acertou 3 perguntas de 3
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-lg font-bold mb-8 uppercase tracking-widest text-white/80">PESQUISA DE SATISFAÇÃO</p>

                            <div className="w-full bg-[#1e293b] rounded-lg border border-gray-700 p-8 flex flex-col items-center max-w-xs shadow-2xl">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-2">
                                        <Icon name="school" className="text-white text-3xl" />
                                    </div>
                                    <p className="text-xs font-semibold text-center leading-tight">Escola de<br/>Negócios<br/>Online</p>
                                </div>

                                <h3 className="text-xl font-bold mb-2">Obrigado por responder,</h3>
                                <p className="text-base text-gray-300 max-w-xs mx-auto mb-8">
                                    sua opinião é muito importante para nós
                                </p>

                                <div className="flex items-center justify-center gap-6">
                                    <div className="flex flex-col items-center gap-1">
                                         <Icon name="favorite" className="text-red-400 text-4xl" filled />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                         <Icon name="forum" className="text-gray-400 text-4xl" filled />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                         <Icon name="check_circle" className="text-gray-400 text-4xl" filled />
                                    </div>
                                </div>
                                <div className="flex justify-center gap-2 mt-6">
                                     <div className="w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-500"></div>
                                     <div className="w-10 h-10 bg-gray-500 rounded-full border-2 border-gray-400 -mt-3 relative z-10"></div>
                                     <div className="w-10 h-10 bg-gray-600 rounded-full border-2 border-gray-500"></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
           </div>
       )
   }

   // --- RENDER: QUESTION SCREEN ---
   const title = isEvaluation ? '[QUIZ_NAME]' : isNPS ? '[NPS_SURVEY_NAME]' : '[QUIZ_SEARCH_NAME]';
   const question = isEvaluation ? '[QUIZ_QUESTION]' : isNPS ? 'Em uma escala de X a Y, o quanto você indicaria nosso curso para um amigo?' : '[QUIZ_SEARCH_QUESTION]';

   return (
      <div className="bg-white h-full flex flex-col font-sans text-gray-800 relative">
         {/* Web Header */}
         <div className="h-14 flex items-center justify-between px-4 bg-[#f8f9fa] border-b border-gray-200 flex-shrink-0">
            <button 
               onClick={onBackToWhatsapp}
               className="bg-[#6bb847] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90 transition-opacity"
            >
               <Icon name="whatsapp" className="text-sm" /> Retornar
            </button>
            <button className="bg-[#6bb847] text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm hover:opacity-90 transition-opacity">
               <Icon name="chat" className="text-sm" /> Suporte
            </button>
         </div>

         {/* Content */}
         <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center w-full">
            
            <h1 className="text-lg font-bold text-[#5e5e5e] text-center mb-8 mt-4 uppercase">
               {title}
            </h1>

            <h2 className="text-base font-bold text-[#5e5e5e] text-center mb-8 px-2">
               {question}
            </h2>

            <div className="w-full space-y-4 max-w-xs mx-auto flex-1 flex flex-col">
               {isQuantitative ? (
                  <>
                     {[1, 2, 3, 4].map((i) => (
                        <button 
                            key={i} 
                            onClick={onNextStep}
                            className="w-full py-4 border border-[#9c6bb8] rounded-lg text-[#5e5e5e] font-bold text-center hover:bg-purple-50 transition-colors uppercase shadow-sm bg-white"
                        >
                           [QUESTION_ALTERNATIVE]
                        </button>
                     ))}
                  </>
               ) : isNPS ? (
                   <div className="flex flex-col items-center justify-center flex-1">
                       <div className="flex flex-wrap gap-2 justify-center mb-4">
                           {Array.from({ length: flowType === 'nps-5' ? 5 : 10 }, (_, i) => i + 1).map((num) => (
                               <button
                                   key={num}
                                   onClick={onNextStep}
                                   className="w-10 h-10 border border-[#9c6bb8] rounded-md text-[#5e5e5e] font-bold hover:bg-[#9c6bb8] hover:text-white transition-colors shadow-sm bg-white"
                               >
                                   {num}
                               </button>
                           ))}
                       </div>
                       <div className="flex justify-between w-full text-xs text-gray-500 px-1 mt-2">
                           <span>Discordo Totalmente</span>
                           <span>Concordo Totalmente</span>
                       </div>
                   </div>
               ) : (
                  <div className="w-full h-full flex flex-col">
                     <textarea 
                        className="w-full flex-1 min-h-[300px] border border-[#d6cce5] rounded-lg p-4 text-gray-600 focus:outline-none focus:border-[#9c6bb8] focus:ring-1 focus:ring-[#9c6bb8] transition-all resize-none shadow-sm placeholder-gray-500 font-bold"
                        placeholder="Deixe seu comentário aqui ..."
                     ></textarea>
                  </div>
               )}
            </div>

         </div>

         {/* Footer */}
         <div className="p-4 flex items-center justify-between flex-shrink-0 mb-2 w-full border-t border-gray-100">
            <button className="bg-[#8e5ba8] text-white px-6 py-2 rounded text-xs font-bold shadow-md hover:bg-[#7d4e94] flex items-center gap-1 min-w-[90px] justify-center opacity-50 cursor-not-allowed">
               <Icon name="chevron_left" size="sm"/> Anterior
            </button>
            
            <span className="text-xs font-bold text-gray-700">1 de 3</span>

            <button 
                onClick={onNextStep}
                className="bg-[#8e5ba8] text-white px-6 py-2 rounded text-xs font-bold shadow-md hover:bg-[#7d4e94] min-w-[90px] justify-center"
            >
               Responder
            </button>
         </div>
      </div>
   );
};

// --- TYPES & HELPERS FOR STEPS ---
type FlowStepId = 'whatsapp' | 'question' | 'result';
interface SimulationStep {
    id: FlowStepId;
    label: string;
    icon: string;
}

const getSimulationSteps = (flowType: 'qualitative' | 'quantitative' | 'evaluation' | 'nps-5' | 'nps-10'): SimulationStep[] => {
    return [
        { id: 'whatsapp', label: '1. Notificação (WhatsApp)', icon: 'chat' },
        { id: 'question', label: '2. Resposta (Navegador)', icon: 'web' },
        { id: 'result', label: '3. Conclusão (Feedback)', icon: 'check_circle' }
    ];
};

export const StoryMappingModal: React.FC<StoryMappingModalProps> = ({ isOpen, onClose, data, onInternalLinkClick }) => {
  const [viewMode, setViewMode] = useState<'map' | 'preview'>('map');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Navigation State
  const [activeStepId, setActiveStepId] = useState<FlowStepId>('whatsapp');

  // Prevent background scroll and reset view on open
  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        setViewMode('map');
        setActiveStepId('whatsapp');
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLinkClick = (link: Link) => {
    if (link.type === 'internal' && onInternalLinkClick) {
      onInternalLinkClick(link.url.replace('app://', ''));
      onClose(); // Close modal when navigating internally
    } else {
      window.open(link.url, '_blank');
    }
  };

  // Logic to determine simulation type
  const getSimulationType = (story: Story | null) => {
      if (!story) return 'qualitative';
      const title = story.title.toLowerCase();
      // NPS Check
      if (title.includes('nps')) {
          if (title.includes('1-5')) return 'nps-5';
          return 'nps-10'; // Default 1-10 if not specified or specified
      }
      if (title.includes('avaliação') || title.includes('avaliativo')) return 'evaluation';
      if (title.includes('quantitativa')) return 'quantitative';
      return 'qualitative'; // Default
  };

  // Filter for Consumption Flow stories
  const getConsumptionStories = (data: StoryMapData) => {
     const stories: Story[] = [];
     data.releases.forEach(r => {
        // Filter: Only "Consumo" or "Aluno" releases
        if (r.title.toLowerCase().includes('consumo') || r.title.toLowerCase().includes('aluno')) {
            data.activities.forEach(a => {
                const s = data.stories[r.id]?.[a.id];
                if (s) stories.push(...s);
            });
        }
     });
     return stories;
  };

  const consumptionStories = data ? getConsumptionStories(data) : [];
  const simulationType = getSimulationType(selectedStory);
  const waMode = simulationType === 'evaluation' ? 'evaluation' : (simulationType === 'nps-5' || simulationType === 'nps-10') ? 'nps' : 'survey';
  
  const currentSteps = getSimulationSteps(simulationType);

  const handleSelectStory = (story: Story) => {
      if (selectedStory?.id !== story.id) {
        setSelectedStory(story);
        setActiveStepId('whatsapp'); // Reset to start
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center animate-fadeIn p-4 sm:p-8" onClick={onClose}>
      <div 
        className="bg-white w-full h-full max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 ${viewMode === 'preview' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'} rounded-lg flex items-center justify-center`}>
                <Icon name={viewMode === 'preview' ? "smartphone" : "map"} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-900">{viewMode === 'preview' ? 'Navegação' : (data?.title || 'Story Map')}</h2>
                <p className="text-sm text-gray-500">{viewMode === 'preview' ? 'Simulação da experiência do usuário (WhatsApp > Web)' : 'Visão geral do produto e entregas'}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
              {viewMode === 'map' ? (
                  <button 
                    onClick={() => { setViewMode('preview'); setActiveStepId('whatsapp'); setSelectedStory(null); }}
                    className="h-10 px-4 border border-purple-600 text-purple-600 rounded-full text-sm font-semibold hover:bg-purple-50 flex items-center gap-2 transition-colors"
                  >
                      <Icon name="visibility" size="sm" />
                      <span>Visualizar</span>
                  </button>
              ) : (
                  <button 
                    onClick={() => setViewMode('map')}
                    className="h-10 px-4 border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 flex items-center gap-2 transition-colors"
                  >
                      <Icon name="arrow_back" size="sm" />
                      <span>Voltar ao Mapa</span>
                  </button>
              )}
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <Icon name="close" />
              </button>
          </div>
        </div>

        {/* Content Area */}
        {data ? (
            viewMode === 'map' ? (
                // --- MAP VIEW ---
                <div className="flex-1 overflow-auto bg-[#f8f9fa] p-6">
                    <div className="flex gap-6 min-w-max">
                        {data.activities.map(activity => (
                            <div key={activity.id} className="w-80 flex-shrink-0 flex flex-col gap-4">
                                {/* Header Card */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center uppercase font-bold text-gray-800 flex flex-col items-center justify-center min-h-[80px]">
                                    {activity.title}
                                    {activity.subtitle && <div className="text-xs text-gray-500 mt-1 font-normal normal-case">{activity.subtitle}</div>}
                                </div>
                                
                                {/* Stories grouped by Release */}
                                <div className="flex-1">
                                    {data.releases.map(release => {
                                        const stories = data.stories[release.id]?.[activity.id];
                                        if (!stories || stories.length === 0) return null;
                                        return (
                                            <div key={release.id} className="mb-6">
                                                <h5 className="text-xs font-bold text-purple-600 uppercase mb-2 pl-1">{release.title}</h5>
                                                <div className="flex flex-col gap-2">
                                                    {stories.map(story => (
                                                        <StoryCard key={story.id} story={story} onLinkClick={handleLinkClick} />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // --- PREVIEW VIEW (Mobile Mockup) ---
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Navigation */}
                    <aside className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Fluxos de Consumo</h3>
                            <p className="text-sm text-gray-500">Selecione para simular o fluxo</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                             {consumptionStories.length > 0 ? (
                                 <div className="space-y-1">
                                    {consumptionStories.map(story => {
                                        const isSelected = selectedStory?.id === story.id;
                                        return (
                                            <div key={story.id} className="mb-2">
                                                <button
                                                    onClick={() => handleSelectStory(story)}
                                                    className={`w-full text-left p-3 flex items-center gap-3 transition-colors rounded-lg mx-1 max-w-[98%] ${isSelected ? 'bg-purple-600 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'}`}
                                                >
                                                    <Icon name={getSimulationType(story).includes('nps') ? 'speed' : 'play_arrow'} size="sm" className={isSelected ? 'text-white' : 'text-gray-300'} />
                                                    <span className="text-sm font-medium truncate">{story.title}</span>
                                                </button>
                                                
                                                {/* Expanded Steps */}
                                                {isSelected && (
                                                    <div className="ml-5 pl-4 border-l-2 border-purple-100 mt-2 space-y-1 mb-3 animate-fadeIn">
                                                        {currentSteps.map((step) => {
                                                            const isActiveStep = activeStepId === step.id;
                                                            return (
                                                                <button
                                                                    key={step.id}
                                                                    onClick={() => setActiveStepId(step.id)}
                                                                    className={`w-full text-left px-3 py-2 flex items-center gap-2 rounded-md transition-colors text-xs font-medium ${isActiveStep ? 'bg-purple-50 text-purple-700' : 'text-gray-500 hover:text-purple-600'}`}
                                                                >
                                                                    <div className={`w-2 h-2 rounded-full ${isActiveStep ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                                                                    {step.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                 </div>
                             ) : (
                                <p className="p-4 text-center text-gray-500 text-sm">Nenhum fluxo de consumo encontrado para simulação.</p>
                             )}
                        </div>
                    </aside>

                    {/* Mobile Mockup Area */}
                    <main className="w-2/3 flex items-center justify-center bg-gray-100 p-4">
                         <div className="relative bg-gray-800 w-full max-w-[375px] h-full max-h-[750px] rounded-[40px] shadow-2xl p-3 flex flex-col border-[4px] border-gray-700 ring-4 ring-gray-300">
                            {/* Notch */}
                            <div className="bg-black w-24 h-5 rounded-b-xl mx-auto mb-2 flex-shrink-0 absolute left-1/2 -translate-x-1/2 top-4 z-50"></div>
                            
                            <div className="bg-white flex-1 rounded-[25px] flex flex-col overflow-hidden relative">
                                {selectedStory ? (
                                    activeStepId === 'whatsapp' ? (
                                        <WhatsAppScreen 
                                            type={waMode} 
                                            onNextStep={() => setActiveStepId('question')} 
                                        />
                                    ) : (
                                        <WebSimulationScreen 
                                            step={activeStepId === 'result' ? 'result' : 'question'}
                                            flowType={simulationType}
                                            onNextStep={() => setActiveStepId('result')}
                                            onBackToWhatsapp={() => setActiveStepId('whatsapp')}
                                        />
                                    )
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <Icon name="touch_app" size="lg" className="opacity-50" />
                                        </div>
                                        <h3 className="text-gray-900 font-semibold mb-2">Simulador de Fluxo</h3>
                                        <p className="text-sm">Selecione uma história na lista ao lado para iniciar a simulação do fluxo WhatsApp &gt; Smartzap.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            )
        ) : (
             <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Nenhum dado encontrado para o Story Map.</p>
            </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scaleUp { animation: scaleUp 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};