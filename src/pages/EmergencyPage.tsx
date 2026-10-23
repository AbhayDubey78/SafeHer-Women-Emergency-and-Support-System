import React from 'react';
import { AlertOctagon, ShieldAlert, PhoneCall, Volume2, Radio, Lock } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SOSButton } from '../components/common/SOSButton';

export const EmergencyPage: React.FC = () => {
  const { isEmergencyActive, confirmSosEmergency, trustedContacts, openFakeCallModal } = useSafety();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-extrabold uppercase tracking-wider border border-rose-500/30 animate-pulse">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>Emergency Control Center</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Emergency Assistance</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Tap the SOS button to start a 5-second countdown alert, audio siren alarm, and location broadcast.
        </p>
      </div>

      {/* Main SOS Trigger Hub */}
      <div className="glass-card p-8 rounded-3xl border border-rose-900/40 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
        <SOSButton size="large" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md pt-4">
          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL POLICE (112)</span>
          </a>

          <a
            href="tel:1091"
            className="p-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>DIAL HELPLINE (1091)</span>
          </a>
        </div>
      </div>

    </div>
  );
};
