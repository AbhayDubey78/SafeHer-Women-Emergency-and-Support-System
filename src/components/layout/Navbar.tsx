import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Bell, 
  User, 
  LogOut, 
  Cpu, 
  Compass, 
  Menu, 
  X, 
  Check, 
  PhoneCall, 
  ChevronDown 
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, toggleMobileMenu }) => {
  const { 
    user, 
    safetyStatus, 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications,
    openFakeCallModal,
    setUser 
  } = useSafety();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getStatusBadge = () => {
    switch (safetyStatus) {
      case 'sos_active':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-xs font-extrabold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>SOS ACTIVE</span>
          </div>
        );
      case 'sharing_location':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/50 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span>LOCATION SHARING</span>
          </div>
        );
      case 'monitoring':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/50 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-sky-400 animate-spin" />
            <span>CHECK-IN MONITORING</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>STATUS: SAFE</span>
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Hamburger (Mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 fill-white" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Safe<span className="text-rose-500">Her</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Women Safety Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center: Safety Status Badge */}
        <div className="hidden sm:flex items-center">
          {getStatusBadge()}
        </div>

        {/* Right: Quick Tools & User Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Fake Call Shortcut Button */}
          <button
            onClick={openFakeCallModal}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all"
            title="Trigger Fake Call to exit uncomfortable situations"
          >
            <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fake Call</span>
          </button>

          {/* Architecture Viewer Shortcut */}
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'architecture'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="View System Architecture & ER Diagram"
          >
            <Cpu className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">System Architecture</span>
          </button>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative border border-slate-700"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Notifications ({notifications.length})
                  </h3>
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No new notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.read
                            ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                            : 'bg-slate-800/60 border-slate-700 text-slate-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-rose-400">{n.title}</span>
                          <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-xl object-cover border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fade-in space-y-2">
                <div className="px-2 py-1.5 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile & Settings</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('login');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
