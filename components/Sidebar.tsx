import React from 'react';
import { Icon } from './Icon';
import { analytics } from '../services/analytics';
import { View } from '../types';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    currentView: View;
    onViewChange: (view: View) => void;
}

const mainNavItems = [
  { id: 'home', icon: 'home', label: 'Home', targetView: 'visaoGeral' as View },
  { id: 'pulses', icon: 'adjust', label: 'Pulses', targetView: 'social' as View },
  { id: 'matriculas', icon: 'school', label: 'Matriculas', targetView: 'cursos' as View },
  { id: 'ranking', icon: 'bar_chart', label: 'Ranking', targetView: 'liderados' as View },
];

const footerNavItems = [
  { id: 'admin', icon: 'settings', label: 'Admin', targetView: 'visaoGeral' as View },
  { id: 'help', icon: 'help', label: 'Ajuda', targetView: 'visaoGeral' as View },
];

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}> = ({ icon, label, isActive = false, isCollapsed, onClick }) => {
  const baseClasses = 'w-full rounded-lg transition-colors';
  const collapsedClasses = 'h-12 flex items-center justify-center';
  const expandedClasses = 'min-h-[64px] px-2 py-2 flex flex-col items-center justify-center';
  const activeClasses = 'bg-white/18 text-white';
  const inactiveClasses = 'text-white/55 hover:text-white hover:bg-white/10';

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isCollapsed ? collapsedClasses : expandedClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={label}
    >
      <Icon name={icon} className={isCollapsed ? 'text-2xl' : 'text-xl'} />
      {!isCollapsed && <span className="text-[11px] font-medium leading-4 text-center mt-1.5">{label}</span>}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, currentView, onViewChange }) => {
  const handleMainNavClick = (item: typeof mainNavItems[0]) => {
    analytics.track('sidebar_nav_clicked', { item: item.id, target_view: item.targetView });
    onViewChange(item.targetView);
  };

  return (
    <aside
      className={`bg-[#6236BF] text-white px-2 py-3 flex flex-col items-center transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-[112px]'}`}
      aria-label="Main Navigation"
    >
      <div className="h-20 shrink-0 flex items-center justify-center w-full">
        <button
          onClick={onToggle}
          className="rounded-lg p-2 bg-white/20 hover:bg-white/30 transition-colors"
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <img
            src="https://assets.keepsdev.com/images/avatars/company_blue.png"
            alt="Workspace logo"
            className="w-10 h-10 rounded-md object-cover"
          />
        </button>
      </div>

      <nav className="w-full space-y-2">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.targetView}
            isCollapsed={isCollapsed}
            onClick={() => handleMainNavClick(item)}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="w-full space-y-2 mb-1">
        {footerNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={false}
            isCollapsed={isCollapsed}
            onClick={() => handleMainNavClick(item)}
          />
        ))}
      </nav>
    </aside>
  );
};
