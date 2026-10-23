import React from 'react';
import { 
  LayoutDashboard, 
  AlertOctagon, 
  MapPin, 
  Users, 
  Activity, 
  History, 
  PhoneCall, 
  BookOpen, 
  Cpu, 
  Settings, 
  Info, 
  X 
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  closeMobileMenu,
}) => {
  const { isEmergencyActive, trustedContacts } = useSafety();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'emergency', label: 'Emergency SOS', icon: AlertOctagon, highlight: isEmergencyActive },
    { id: 'location', label: 'Live Location', icon: MapPin },
    { id: 'contacts', label: 'Trusted Contacts', icon: Users, count: trustedContacts.length },
    { id: 'monitoring', label: 'Safety Monitoring', icon: Activity },
    { id: 'history', label: 'Incident History', icon: History },
    { id: 'resources', label: 'Emergency Helplines', icon: PhoneCall },
    { id: 'tips', label: 'Safety Tips & Tools', icon: BookOpen },
    { id: 'architecture', label: 'System Architecture', icon: Cpu, badge: 'ERD' },
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
    { id: 'about', label: 'About & Help', icon: Info },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 left-0 z-50 md:z-30 w-64 h-full md:h-[calc(100vh-4rem)] glass-panel border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header for Mobile */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-800">
          <span className="text-base font-extrabold text-white">SafeHer Menu</span>
          <button onClick={closeMobileMenu} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Link List */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : item.highlight
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-rose-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Quick SOS Pill */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-900/40 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Emergency Helpline</p>
            <p className="text-sm font-extrabold text-white mt-0.5">National SOS: 112</p>
            <p className="text-[10px] text-slate-400 mt-1">24/7 Toll-Free Dispatch</p>
          </div>
        </div>
      </aside>
    </>
  );
};
