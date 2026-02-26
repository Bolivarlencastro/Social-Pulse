
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
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleSidebar}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                aria-label="Menu principal"
              >
                <Icon name="menu" />
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
                
                <button
                    className="w-12 h-12 hidden lg:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="Tela cheia"
                >
                    <Icon name="fullscreen" />
                </button>
                
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
                    className="w-12 h-12 hidden sm:flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                    aria-label="Logo Kee"
                >
                    <Icon name="apps" />
                </button>

                <button className="hidden sm:flex items-center gap-2 h-12 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <span className="text-sm">
                        <span className="text-gray-500">Saldo: </span>
                        <span className="font-bold text-gray-900">-55 ZAPS</span>
                    </span>
                    <Icon name="info" size="sm" className="text-gray-500" />
                </button>
                
                <div className="hidden sm:block h-8 w-px bg-gray-200 mx-2"></div>

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
