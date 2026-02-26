
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {

  return (
    <>
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={onToggleSidebar}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Menu principal"
              >
                <Icon name="menu" />
              </button>

              <div className="pl-4 min-w-0 flex-1 flex items-center">
                <button
                  className="w-12 h-12 flex sm:hidden items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors ml-auto"
                  aria-label="Busca global"
                >
                  <Icon name="search" />
                </button>
                <button
                  className="hidden sm:flex h-10 rounded-full items-center px-3 gap-2 bg-gray-100 text-gray-600 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow w-full"
                  aria-label="Busca global"
                >
                  <Icon name="search" size="sm" />
                  <span className="text-sm leading-none truncate">Pesquisar em todo o Konquest</span>
                </button>
              </div>

              <button
                className="w-12 h-12 hidden lg:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
                aria-label="Criar conteúdo"
              >
                <Icon name="add" />
              </button>

              <button
                className="w-12 h-12 hidden lg:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
                aria-label="Tela cheia"
              >
                <Icon name="fullscreen" />
              </button>

            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <div className="relative">
                    <button
                        className="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                        aria-label="Notificações"
                    >
                        <Icon name="notifications" />
                    </button>
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center rounded-full">3</span>
                </div>

                <button
                    className="w-12 h-12 hidden lg:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="Minhas estatísticas"
                >
                    <Icon name="insert_chart" />
                </button>

                <button
                    className="w-12 h-12 hidden sm:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="Menu de apps"
                >
                    <Icon name="apps" />
                </button>

                <button className="flex items-center gap-2 p-1.5 h-12 rounded-full hover:bg-gray-200 transition-colors">
                    <img
                        className="h-9 w-9 rounded-full object-cover"
                        src="https://i.pravatar.cc/40?u=super-admin"
                        alt="User profile"
                    />
                    <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-sm font-semibold text-gray-800">Super Admin</span>
                        <span className="text-xs text-gray-500">Keeps</span>
                    </div>
                    <Icon name="expand_more" className="hidden md:block text-gray-500" />
                </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
