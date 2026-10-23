import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Users, 
  MapPin, 
  PhoneCall, 
  ArrowRight, 
  Zap, 
  Lock, 
  Award, 
  HeartHandshake, 
  CheckCircle2, 
  Cpu 
} from 'lucide-react';
import { SOSButton } from '../components/common/SOSButton';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewArchitecture: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewArchitecture }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      
      {/* Hero Header */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-8 overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-extrabold uppercase tracking-widest animate-bounce">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Women Safety & Emergency Monitoring System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight max-w-5xl mx-auto">
          Instant Emergency Response <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-amber-300">
            For Complete Safety & Peace of Mind
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          SafeHer connects women directly to trusted emergency contacts, live GPS location sharing, police dispatch helplines, and safety check-in monitors in high-risk situations.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base shadow-xl shadow-rose-600/30 transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            <span>Launch SafeHer App</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onViewArchitecture}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-card hover:bg-slate-800 text-slate-200 font-bold text-base border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-5 h-5 text-rose-400" />
            <span>View Architecture & ERD</span>
          </button>
        </div>

        {/* Live SOS Button Interactive Demo Showcase */}
        <div className="pt-10 flex flex-col items-center">
          <div className="p-6 rounded-3xl glass-card border border-rose-500/30 shadow-2xl max-w-md w-full">
            <p className="text-xs font-extrabold uppercase tracking-widest text-rose-400 mb-4">
              Interactive Emergency SOS Trigger
            </p>
            <SOSButton size="large" />
          </div>
        </div>

      </section>

      {/* Key Stats Counter */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">&lt; 5s</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Alert Dispatch Time</p>
          </div>
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">100%</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Live Telemetry Accuracy</p>
          </div>
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-black text-sky-400 font-mono">24/7</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Emergency Helpline Access</p>
          </div>
          <div className="p-4">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">256-bit</p>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Secure Privacy PIN</p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
            System Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Designed For Rapid Action & Protection
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Combining smart GPS telemetry, multi-channel alert dispatch, fake call tools, and automated travel check-in monitors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-rose-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Emergency SOS Mode</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              One-tap SOS activation with 5-second cancel countdown. Sounds alarm siren, records background audio, and broadcasts SMS alerts.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-teal-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Live Location Telemetry</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive map tracking with real-time speed, accuracy radius, battery status, and shareable secure tracking link generation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-sky-500/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white">Trusted Circles</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designate primary emergency contacts, set automated phone calls or SMS rules, and send test alert pings instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Helplines */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span className="text-base font-black text-white">SafeHer System</span>
        </div>
        <p className="text-xs text-slate-500">
          Emergency Helplines: Police 112 • Women Helpline 1091 • Cyber Crime 1930 • Ambulance 102
        </p>
        <p className="text-[11px] text-slate-600">
          Built for Academic & Emergency Response Demonstration. SafeHer © 2026.
        </p>
      </footer>
    </div>
  );
};
