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

const adminSubmenuClusters = [
  {
    id: 'cluster-configuracao',
    label: 'Configuração',
    items: [
      { id: 'nav-link-settings', label: 'Geral', enabled: false },
    ],
  },
  {
    id: 'cluster-operacao',
    label: 'Operação',
    items: [
      { id: 'nav-link-content-management', label: 'Gerenciar Conteúdo', targetView: 'gestaoConteudo' as View, enabled: true },
      { id: 'nav-item-enrollments', label: 'Matrículas', enabled: false, hasArrow: true },
      { id: 'nav-link-normatives', label: 'Normativas', enabled: false },
    ],
  },
  {
    id: 'cluster-personalizacao',
    label: 'Personalização',
    items: [
      { id: 'nav-link-custom-certificates', label: 'Certificados Personalizados', enabled: false },
      { id: 'nav-link-custom-sections', label: 'Seções Personalizadas', enabled: false },
      { id: 'nav-item-groups', label: 'Grupos', enabled: false },
      { id: 'nav-item-categories', label: 'Categorias', enabled: false },
    ],
  },
  {
    id: 'cluster-ecossistema',
    label: 'Ecossistema',
    items: [
      { id: 'nav-link-transfers', label: 'Transferências', enabled: false },
      { id: 'nav-link-integrations', label: 'Integrações', enabled: false },
      { id: 'nav-link-marketplace', label: 'Marketplace', enabled: false },
    ],
  },
  {
    id: 'cluster-auditoria',
    label: 'Auditoria',
    items: [
      { id: 'nav-link-activity-log', label: 'Log de Atividades', enabled: false },
    ],
  },
] as const;

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
  const [isAdminSubmenuOpen, setIsAdminSubmenuOpen] = React.useState(false);
  const adminMenuRef = React.useRef<HTMLDivElement | null>(null);
  const adminTriggerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideMenu = adminMenuRef.current?.contains(target);
      const clickedInsideTrigger = adminTriggerRef.current?.contains(target);
      if (!clickedInsideMenu && !clickedInsideTrigger) {
        setIsAdminSubmenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  React.useEffect(() => {
    if (currentView === 'gestaoConteudo') {
      setIsAdminSubmenuOpen(true);
    }
  }, [currentView]);

  const handleMainNavClick = (item: typeof mainNavItems[0]) => {
    analytics.track('sidebar_nav_clicked', { item: item.id, target_view: item.targetView });
    onViewChange(item.targetView);
    setIsAdminSubmenuOpen(false);
  };

  return (
    <aside
      className={`pointer-events-auto relative bg-[#6236BF] text-white px-2 py-3 flex flex-col items-center transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-[112px]'}`}
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
          item.id === 'admin' ? (
            <div key={item.id} ref={adminTriggerRef}>
              <NavItem
                icon={item.icon}
                label={item.label}
                isActive={isAdminSubmenuOpen || currentView === 'gestaoConteudo'}
                isCollapsed={isCollapsed}
                onClick={() => setIsAdminSubmenuOpen((prev) => !prev)}
              />
            </div>
          ) : (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={false}
              isCollapsed={isCollapsed}
              onClick={() => handleMainNavClick(item)}
            />
          )
        ))}
      </nav>

      {isAdminSubmenuOpen && (
        <div
          ref={adminMenuRef}
          className="absolute top-0 bottom-0 left-full w-[300px] border-l border-white/40 bg-[#6236BF] z-40 py-6 px-0 overflow-y-auto"
        >
          <div className="space-y-5 px-3">
            {adminSubmenuClusters.map((cluster) => (
              <div key={cluster.id}>
                <p className="px-3 mb-2 text-[11px] tracking-[0.08em] uppercase text-white/55 font-semibold">{cluster.label}</p>
                <div className="space-y-1">
                  {cluster.items.map((item) => {
                    const isGestaoConteudo = item.id === 'nav-link-content-management';
                    const isActive = isGestaoConteudo && currentView === 'gestaoConteudo';
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          analytics.track('sidebar_admin_submenu_clicked', { item: item.id });
                          if (item.enabled && isGestaoConteudo) {
                            onViewChange('gestaoConteudo');
                            setIsAdminSubmenuOpen(false);
                          }
                        }}
                        className={`w-full min-h-[40px] pl-6 pr-3 rounded-md text-left text-[12px] font-medium flex items-center justify-between transition-colors ${
                          isActive ? 'bg-white/18 text-white' : 'text-white/80 hover:bg-white/12 hover:text-white'
                        } ${item.enabled ? '' : 'opacity-65'}`}
                        aria-disabled={!item.enabled}
                        title={item.enabled ? item.label : 'Em breve'}
                      >
                        <span>{item.label}</span>
                        {item.hasArrow ? <Icon name="chevron_right" size="sm" className="text-white/80" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
