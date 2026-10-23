import React from 'react';
import { AlertTriangle, XCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export const SOSCountdownModal: React.FC = () => {
  const { 
    isSosCountdownActive, 
    sosCountdownSeconds, 
    cancelSosCountdown, 
    confirmSosEmergency 
  } = useSafety();

  if (!isSosCountdownActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-600/80 rounded-3xl p-6 shadow-2xl text-center space-y-6">
        
        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>Emergency Countdown Active</span>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">Starting Emergency Mode</h2>
          <p className="text-xs text-slate-300 mt-1">
            Dispatching live coordinates and distress SMS to all trusted contacts in:
          </p>
        </div>

        {/* Big Animated Countdown Circle */}
        <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="currentColor"
              strokeWidth="10"
              className="text-rose-500 transition-all duration-1000 ease-linear"
              fill="transparent"
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * (5 - sosCountdownSeconds)) / 5}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-5xl font-black text-white font-mono drop-shadow-lg">
            {sosCountdownSeconds}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => confirmSosEmergency('SOS Button Triggered')}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>TRIGGER SOS IMMEDIATELY</span>
          </button>

          <button
            onClick={cancelSosCountdown}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>I'm Safe - Cancel Alert</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Accidental trigger prevention: Tap "Cancel Alert" above to stop broadcast.
        </p>
      </div>
    </div>
  );
};
