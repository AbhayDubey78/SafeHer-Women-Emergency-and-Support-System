import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Battery, 
  Radio, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Users 
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const SafetyMonitoringPage: React.FC = () => {
  const { 
    safetyStatus, 
    telemetry, 
    trustedContacts, 
    activeCheckIn, 
    startCheckInTimer, 
    cancelCheckInTimer,
    emergencyHistory 
  } = useSafety();

  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(20);

  // Calculate dynamic Safety Index Score
  const computeSafetyScore = () => {
    let score = 100;
    if (!telemetry.isSharingActive) score -= 10;
    if (trustedContacts.length < 2) score -= 15;
    if (telemetry.batteryLevel < 30) score -= 15;
    if (safetyStatus === 'sos_active') score = 0;
    return Math.max(0, score);
  };

  const score = computeSafetyScore();

  const handleStartCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination) {
      startCheckInTimer(destination, duration);
      setDestination('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <Activity className="w-7 h-7 text-teal-400" />
          <span>Safety Monitoring Dashboard</span>
        </h1>
        <p className="text-xs text-slate-400">Continuous risk evaluation, surroundings awareness & safety check-ins</p>
      </div>

      {/* Safety Score & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Safety Score Meter Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Real-Time Safety Index</p>

          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="60" stroke="#1e293b" strokeWidth="10" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke={score > 80 ? '#22c55e' : score > 50 ? '#eab308' : '#f43f5e'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-black text-white font-mono">{score}</span>
              <span className="block text-[9px] text-slate-400 font-bold uppercase">/ 100 Score</span>
            </div>
          </div>

          <p className="text-xs font-bold text-slate-200">
            {score > 80 ? 'Optimal Protection Level' : score > 50 ? 'Moderate Caution Advised' : 'High Risk - Trigger SOS!'}
          </p>
        </div>

        {/* Status Indicators Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Live Location Status</span>
              <Radio className={`w-4 h-4 ${telemetry.isSharingActive ? 'text-teal-400 animate-pulse' : 'text-slate-500'}`} />
            </div>
            <p className="text-sm font-black text-white">
              {telemetry.isSharingActive ? 'Broadcasting Active' : 'Location Paused'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">±{telemetry.accuracyMeters}m accuracy</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Trusted First Responders</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-sm font-black text-white">{trustedContacts.length} Contacts Active</p>
            <p className="text-[11px] text-teal-400">Primary: {trustedContacts.find(c => c.isPrimary)?.name || 'None'}</p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Check-In Monitor</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm font-black text-white">
              {activeCheckIn ? `${Math.floor(activeCheckIn.remainingSeconds / 60)}m Remaining` : 'No Active Timer'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {activeCheckIn ? activeCheckIn.destinationName : 'Set ride check-in below'}
            </p>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase">Battery & Power</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-sm font-black text-white">{telemetry.batteryLevel}% Battery Level</p>
            <p className="text-[11px] text-emerald-400">Power Savings Normal</p>
          </div>

        </div>

      </div>

      {/* Ride / Travel Safety Check-in Setup Widget */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            <span>Travel Check-In Timer Monitor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Use when taking cabs, auto-rickshaws, late night walks, or visiting unfamiliar locations.
          </p>
        </div>

        {activeCheckIn ? (
          <div className="p-4 rounded-2xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-sky-300">Active Check-In: {activeCheckIn.destinationName}</p>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Expiring in {Math.floor(activeCheckIn.remainingSeconds / 60)}m {activeCheckIn.remainingSeconds % 60}s
              </p>
            </div>
            <button
              onClick={cancelCheckInTimer}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow"
            >
              I Have Arrived Safely
            </button>
          </div>
        ) : (
          <form onSubmit={handleStartCheckIn} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination / Cab Plate No."
              className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
              required
            />
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
            >
              <option value={10}>10 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow transition-all"
            >
              Start Safety Check-In
            </button>
          </form>
        )}
      </div>

      {/* Activity Timeline */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-400" />
          <span>Safety Activity Log Timeline</span>
        </h3>

        <div className="space-y-3">
          {emergencyHistory.slice(0, 4).map((evt) => (
            <div key={evt.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <div className={`p-2 rounded-xl text-white mt-0.5 ${
                evt.status === 'active' ? 'bg-rose-600 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{evt.eventType}</p>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(evt.triggeredAt).toLocaleDateString()} {new Date(evt.triggeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{evt.location.address}</p>
                {evt.cancellationReason && (
                  <p className="text-[10px] text-teal-400 font-semibold mt-1">Note: {evt.cancellationReason}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
