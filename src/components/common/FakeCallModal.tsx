import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, Volume2, User } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { audioService } from '../../services/audioService';

export const FakeCallModal: React.FC = () => {
  const { isFakeCallOpen, closeFakeCallModal } = useSafety();
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (isFakeCallOpen) {
      setCallState('ringing');
      setCallDuration(0);
    }
  }, [isFakeCallOpen]);

  useEffect(() => {
    let timer: number;
    if (callState === 'connected') {
      timer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isFakeCallOpen) return null;

  const handleAnswer = () => {
    audioService.stopRingtone();
    setCallState('connected');
  };

  const handleDecline = () => {
    audioService.stopRingtone();
    setCallState('ended');
    setTimeout(() => {
      closeFakeCallModal();
    }, 500);
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl text-white p-4 animate-fade-in">
      <div className="w-full max-w-sm flex flex-col items-center justify-between min-h-[560px] py-12 px-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
        
        {/* Top Calling Status */}
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {callState === 'ringing' ? 'INCOMING CALL...' : callState === 'connected' ? 'CALL CONNECTED' : 'CALL ENDED'}
          </p>
          <h2 className="text-2xl font-black text-white">Dad (Rakesh Sharma)</h2>
          <p className="text-xs text-slate-400 font-mono">+91 98111 55667</p>

          {callState === 'connected' && (
            <p className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 inline-block mt-2">
              {formatDuration(callDuration)}
            </p>
          )}
        </div>

        {/* Avatar Icon */}
        <div className="relative my-8">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-4 border-slate-600 flex items-center justify-center shadow-2xl ${
            callState === 'ringing' ? 'animate-bounce' : ''
          }`}>
            <User className="w-16 h-16 text-slate-300" />
          </div>
          {callState === 'ringing' && (
            <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
          )}
        </div>

        {/* Call Controls depending on state */}
        {callState === 'ringing' ? (
          <div className="w-full flex items-center justify-around">
            <button
              onClick={handleDecline}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-xl transform active:scale-95 transition-all">
                <PhoneOff className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-300">Decline</span>
            </button>

            <button
              onClick={handleAnswer}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-xl animate-pulse transform active:scale-95 transition-all">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-300">Answer</span>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-center gap-6 text-slate-400">
              <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700">
                <Mic className="w-5 h-5 text-slate-200" />
              </button>
              <button className="p-3 rounded-full bg-slate-800 hover:bg-slate-700">
                <Volume2 className="w-5 h-5 text-slate-200" />
              </button>
            </div>

            <button
              onClick={handleDecline}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <PhoneOff className="w-5 h-5" />
              <span>END FAKE CALL</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
