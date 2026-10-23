import React from 'react';
import { Info, ShieldAlert, Heart, Lock, Code2, Users, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
          <ShieldAlert className="w-6 h-6 fill-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">About SafeHer</h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          SafeHer is a women safety platform designed for rapid emergency assistance, live GPS monitoring, and trusted contact alerts.
        </p>
      </div>

      {/* Security Declaration Box */}
      <div className="glass-card p-6 rounded-3xl border border-rose-500/40 space-y-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Security & Demo Safeguards Declaration</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          SafeHer uses simulated SMS and emergency alerts for interactive demonstration during academic evaluation, hackathons, and user testing. The system does not automatically contact police, ambulance, or emergency services without explicit user interaction.
        </p>
      </div>

      {/* Target Users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white">Women / Students / Travelers</h3>
          <p className="text-xs text-slate-400">
            Provides one-tap SOS, live location tracking, travel check-in timers, and fake calls in uncomfortable situations.
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white">Trusted Family & Friends</h3>
          <p className="text-xs text-slate-400">
            Receive real-time distress alerts, location track links, and battery telemetry when SOS is activated.
          </p>
        </div>

        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-black text-white">Emergency First Responders</h3>
          <p className="text-xs text-slate-400">
            Quick-dial direct links to Police 112, Women Helpline 1091, Cyber Crime 1930, and paramedic notes.
          </p>
        </div>
      </div>

    </div>
  );
};
