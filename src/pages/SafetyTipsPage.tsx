import React, { useState } from 'react';
import { 
  BookOpen, 
  Shield, 
  Eye, 
  Car, 
  Zap, 
  PhoneCall, 
  Volume2, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { safetyTipsList } from '../mockData';
import { useSafety } from '../context/SafetyContext';

export const SafetyTipsPage: React.FC = () => {
  const { openFakeCallModal, toggleSiren, isSirenPlaying } = useSafety();
  const [expandedTipId, setExpandedTipId] = useState<string | null>('tip-1');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car': return Car;
      case 'Eye': return Eye;
      case 'Shield': return Shield;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-rose-400" />
          <span>Safety Recommendations & Quick Tools</span>
        </h1>
        <p className="text-xs text-slate-400">Practical guidelines for travel awareness, night safety, and situational response</p>
      </div>

      {/* Quick Interactive Safety Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={openFakeCallModal}
          className="p-5 rounded-3xl glass-card border border-indigo-500/40 hover:border-indigo-400 text-left space-y-2 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">Fake Call Simulator</h3>
          <p className="text-xs text-slate-300">
            Simulate an incoming phone call from "Dad" with ringtone to comfortably exit uncomfortable situations.
          </p>
        </button>

        <button
          onClick={toggleSiren}
          className={`p-5 rounded-3xl glass-card border text-left space-y-2 transition-all group ${
            isSirenPlaying ? 'border-rose-500 bg-rose-950/40' : 'border-rose-500/40 hover:border-rose-400'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Volume2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-white">
            {isSirenPlaying ? 'Stop Alarm Siren' : 'Loud Audio Siren Alarm'}
          </h3>
          <p className="text-xs text-slate-300">
            Emit a loud wailing siren sound via phone speaker to attract immediate public attention and deter attackers.
          </p>
        </button>
      </div>

      {/* Accordion Safety Guides */}
      <div className="space-y-3">
        <h2 className="text-base font-black text-white">Essential Safety Guides</h2>

        {safetyTipsList.map((tip) => {
          const IconComponent = getIcon(tip.iconName);
          const isExpanded = expandedTipId === tip.id;

          return (
            <div
              key={tip.id}
              className="glass-card rounded-3xl border border-slate-800 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedTipId(isExpanded ? null : tip.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{tip.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{tip.summary}</p>
                  </div>
                </div>

                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-2.5">
                  {tip.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
