import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  MapPin, 
  Users, 
  Clock, 
  PhoneCall, 
  ArrowRight, 
  Activity, 
  Battery, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Compass, 
  ChevronRight, 
  Plus 
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { SOSButton } from '../components/common/SOSButton';
import { InteractiveMap } from '../components/common/InteractiveMap';
import { emergencyResources } from '../mockData';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { 
    user, 
    safetyStatus, 
    telemetry, 
    toggleLocationSharing, 
    trustedContacts, 
    emergencyHistory, 
    activeCheckIn,
    startCheckInTimer,
    cancelCheckInTimer,
    openFakeCallModal,
    toggleSiren,
    isSirenPlaying
  } = useSafety();

  const [destination, setDestination] = useState('');
  const [minutes, setMinutes] = useState(15);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const handleStartCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination) {
      startCheckInTimer(destination, minutes);
      setShowCheckInModal(false);
      setDestination('');
    }
  };

  const getStatusBanner = () => {
    switch (safetyStatus) {
      case 'sos_active':
        return (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-900/90 via-red-800 to-rose-900 border-2 border-rose-500 shadow-2xl flex items-center justify-between text-white animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide">EMERGENCY SOS IS ACTIVE</h3>
                <p className="text-xs text-rose-200">Alerts & live coordinates dispatched to contacts</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('emergency')}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow hover:bg-slate-100"
            >
              Manage SOS
            </button>
          </div>
        );
      case 'sharing_location':
        return (
          <div className="p-4 rounded-3xl bg-teal-950/80 border border-teal-500/40 shadow-xl flex items-center justify-between text-teal-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-xl text-teal-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">LIVE LOCATION SHARING IS ON</h3>
                <p className="text-xs text-teal-300">Contacts can view your real-time position</p>
              </div>
            </div>
            <button
              onClick={toggleLocationSharing}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold text-xs"
            >
              Stop Sharing
            </button>
          </div>
        );
      case 'monitoring':
        return (
          <div className="p-4 rounded-3xl bg-sky-950/80 border border-sky-500/40 shadow-xl flex items-center justify-between text-sky-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/20 rounded-xl text-sky-400">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">TRAVEL CHECK-IN TIMER ACTIVE</h3>
                <p className="text-xs text-sky-300">
                  {activeCheckIn ? `Destination: ${activeCheckIn.destinationName} (${Math.floor(activeCheckIn.remainingSeconds / 60)}m left)` : 'Monitoring'}
                </p>
              </div>
            </div>
            <button
              onClick={cancelCheckInTimer}
              className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-xs"
            >
              I'm Safe - Stop
            </button>
          </div>
        );
      default:
        return (
          <div className="p-4 rounded-3xl glass-card border border-emerald-500/30 shadow-xl flex items-center justify-between text-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold">STATUS: SAFE & SECURE</h3>
                <p className="text-xs text-slate-400">All emergency monitoring systems active</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
              <span>Protected</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Greeting & Status Banner */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Hello, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-400">SafeHer Women Protection Dashboard</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>Battery: {telemetry.batteryLevel}%</span>
            <span className="text-slate-600">•</span>
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>±{telemetry.accuracyMeters}m</span>
          </div>
        </div>

        {getStatusBanner()}
      </div>

      {/* Main Grid: SOS Button & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): SOS Button Card */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-rose-900/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 p-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
              One-Tap Dispatch
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Emergency SOS Button</h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap to trigger instant 5-second countdown alert to all {trustedContacts.length} trusted contacts.
            </p>
          </div>

          <SOSButton size="large" />

          {/* Quick Emergency Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full pt-2">
            <button
              onClick={toggleLocationSharing}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                telemetry.isSharingActive
                  ? 'bg-teal-600 text-white border-teal-400 shadow-lg'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <Radio className={`w-4 h-4 ${telemetry.isSharingActive ? 'animate-pulse' : 'text-slate-400'}`} />
              <span>{telemetry.isSharingActive ? 'Sharing ON' : 'Share Location'}</span>
            </button>

            <button
              onClick={openFakeCallModal}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Fake Call</span>
            </button>

            <button
              onClick={() => setShowCheckInModal(true)}
              className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Check-In Timer</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Telemetry Map Card */}
        <div className="glass-card p-4 rounded-3xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Live Location Preview</span>
            </h3>
            <button
              onClick={() => setActiveTab('location')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>Full Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <InteractiveMap
            lat={telemetry.lat}
            lng={telemetry.lng}
            address={telemetry.address}
            accuracyMeters={telemetry.accuracyMeters}
            isSharing={telemetry.isSharingActive}
            height="210px"
          />

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-400 text-[10px]">
              <span>CURRENT ADDRESS</span>
              <span className="text-teal-400 font-bold">GPS SIGNAL GOOD</span>
            </div>
            <p className="text-xs font-medium text-slate-100 truncate">{telemetry.address}</p>
          </div>
        </div>

      </div>

      {/* Trusted Contacts & Emergency Helplines Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Trusted Contacts Preview */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Trusted Emergency Contacts ({trustedContacts.length})</span>
            </h3>
            <button
              onClick={() => setActiveTab('contacts')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {trustedContacts.slice(0, 3).map((contact) => (
              <div key={contact.id} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                      {contact.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">{contact.relationship} • {contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Emergency Helplines Direct Dial */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-400" />
              <span>Official Emergency Direct Dials</span>
            </h3>
            <button
              onClick={() => setActiveTab('resources')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {emergencyResources.slice(0, 4).map((res) => (
              <a
                key={res.id}
                href={`tel:${res.phone}`}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">{res.title}</p>
                  <p className="text-base font-black text-white mt-0.5 font-mono">{res.phone}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Safety Check-In Setup Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <span>Start Travel Check-In Timer</span>
              </h3>
              <button onClick={() => setShowCheckInModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              If you do not check in by the timer expiry, SafeHer will automatically escalate to Emergency SOS!
            </p>

            <form onSubmit={handleStartCheckin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Destination / Ride Detail
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Cab ride to Vasant Kunj"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Duration (Minutes)
                </label>
                <select
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value={5}>5 Minutes (Quick Ride)</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Standard Travel)</option>
                  <option value={60}>60 Minutes (Long Travel)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg"
                >
                  Start Monitoring
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
