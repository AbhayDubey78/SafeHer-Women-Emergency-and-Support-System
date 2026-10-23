import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, Zap } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

interface SOSButtonProps {
  size?: 'normal' | 'large' | 'compact';
}

export const SOSButton: React.FC<SOSButtonProps> = ({ size = 'normal' }) => {
  const { triggerSosCountdown, isEmergencyActive, safetyStatus } = useSafety();
  const [isHolding, setIsHolding] = useState(false);

  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Outer Glow Ring */}
      <div className={`relative flex items-center justify-center ${
        isLarge ? 'w-56 h-56' : isCompact ? 'w-32 h-32' : 'w-44 h-44'
      }`}>
        
        {/* Animated Ripple Circles */}
        <div className="absolute inset-0 rounded-full bg-rose-600/20 animate-ping duration-1000"></div>
        <div className="absolute inset-2 rounded-full bg-rose-500/30 animate-pulse"></div>

        {/* Core SOS Button */}
        <button
          onClick={triggerSosCountdown}
          className={`relative z-10 w-full h-full rounded-full flex flex-col items-center justify-center text-white font-extrabold shadow-2xl transition-all duration-300 transform active:scale-95 sos-pulse-button border-4 ${
            isEmergencyActive
              ? 'bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 border-white'
              : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 border-rose-300/40 hover:border-white'
          }`}
          aria-label="Emergency SOS button"
        >
          <div className="flex flex-col items-center gap-1">
            <AlertOctagon className={`${isLarge ? 'w-12 h-12' : isCompact ? 'w-7 h-7' : 'w-10 h-10'} animate-bounce`} />
            <span className={`${isLarge ? 'text-3xl tracking-widest' : isCompact ? 'text-xl' : 'text-2xl tracking-wider'} font-black drop-shadow-md`}>
              SOS
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 text-rose-100">
              {isEmergencyActive ? 'ACTIVE ALERT' : 'TAP FOR HELP'}
            </span>
          </div>
        </button>
      </div>

      <p className="mt-3 text-xs font-semibold text-rose-300/90 flex items-center gap-1.5 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
        <Zap className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        <span>5-sec confirmation countdown prevents accidental taps</span>
      </p>
    </div>
  );
};
