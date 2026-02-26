
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CoursesPage } from './components/courses/CoursesPage';
import { CreateCoursePage } from './components/courses/CreateCoursePage';
import { SocialPage } from './components/social/SocialPage';
import { StoryMappingModal, useStoryMapping } from './components/StoryMapping';
import { View } from './types';

const App: React.FC = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('social');
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  
  // Para gerenciar o sub-estado de cursos (lista vs criação)
  const [courseViewMode, setCourseViewMode] = useState<'list' | 'create'>('list');

  // Fetch roadmap data once at app level or when needed
  const { data: roadmapData } = useStoryMapping(`${import.meta.env.BASE_URL}roadmap.md`);

  const handleInternalLink = (target: string) => {
    setIsRoadmapOpen(false);
    if (target === 'create-course') {
      setCurrentView('cursos');
      setCourseViewMode('create');
    } else if (target === 'courses-list') {
      setCurrentView('cursos');
      setCourseViewMode('list');
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setMobileSidebarOpen(false);
    // Ao mudar de módulo, resetamos o modo de visualização de cursos para o padrão
    if (view === 'cursos') {
      setCourseViewMode('list');
    }
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setSidebarCollapsed((prev) => !prev);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsRoadmapOpen((prev) => !prev);
      }

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'cursos':
        return courseViewMode === 'list' ? (
          <CoursesPage onCreateCourse={() => setCourseViewMode('create')} />
        ) : (
          <CreateCoursePage onBack={() => setCourseViewMode('list')} />
        );
      case 'social':
        return <SocialPage initialViewMode="feed" />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-8 text-center">
            <div>
              <h2 className="text-xl font-bold mb-2">Visão em desenvolvimento</h2>
              <p>A página "{currentView}" estará disponível em breve.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white text-gray-800 transition-colors duration-300">
        <div className="hidden lg:flex">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setSidebarCollapsed((prev) => !prev)}
            currentView={currentView}
            onViewChange={handleViewChange}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onToggleSidebar={handleToggleSidebar}
          />
          <main className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
             {renderContent()}
          </main>
        </div>
      </div>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Fechar menu"
          />
          <div className="relative h-full pointer-events-none">
            <Sidebar
              isCollapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
              currentView={currentView}
              onViewChange={handleViewChange}
            />
          </div>
        </div>
      )}
      
      <StoryMappingModal 
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        data={roadmapData}
        onInternalLinkClick={handleInternalLink}
      />
    </>
  );
};

export default App;
