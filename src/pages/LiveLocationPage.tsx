import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Share2, 
  Copy, 
  Check, 
  Compass, 
  ShieldCheck, 
  Battery, 
  Plus, 
  Trash2, 
  Navigation, 
  AlertTriangle 
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const LiveLocationPage: React.FC = () => {
  const { 
    telemetry, 
    toggleLocationSharing, 
    geofences,
    addGeofence,
    deleteGeofence,
    trustedContacts
  } = useSafety();

  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);

  // New Geofence State
  const [zoneName, setZoneName] = useState('');
  const [zoneCategory, setZoneCategory] = useState<'home' | 'work' | 'college' | 'other'>('college');
  const [zoneRadius, setZoneRadius] = useState(300);

  const shareableUrl = `https://safeher.app/live-track/usr-101-ananya-89412`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddGeofence = (e: React.FormEvent) => {
    e.preventDefault();
    if (zoneName) {
      addGeofence({
        name: zoneName,
        lat: telemetry.lat,
        lng: telemetry.lng,
        radiusMeters: zoneRadius,
        alertOnExit: true,
        category: zoneCategory,
      });
      setShowGeofenceModal(false);
      setZoneName('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-rose-400" />
            <span>Live Location Tracking Hub</span>
          </h1>
          <p className="text-xs text-slate-400">Continuous GPS telemetry broadcast & geofence safe zones</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocationSharing}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 ${
              telemetry.isSharingActive
                ? 'bg-teal-600 hover:bg-teal-500 text-white border border-teal-400'
                : 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400'
            }`}
          >
            <Radio className={`w-4 h-4 ${telemetry.isSharingActive ? 'animate-pulse' : ''}`} />
            <span>{telemetry.isSharingActive ? 'Stop Sharing' : 'Start Sharing Location'}</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2"
          >
            <Share2 className="w-4 h-4 text-rose-400" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Section */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold">
              <Radio className={`w-4 h-4 ${telemetry.isSharingActive ? 'text-teal-400 animate-pulse' : 'text-slate-500'}`} />
              <span>Status: {telemetry.isSharingActive ? 'BROADCASTING LIVE' : 'LOCATION PAUSED'}</span>
            </span>

            <span className="flex items-center gap-1.5 font-mono text-slate-400 hidden sm:flex">
              <Compass className="w-4 h-4 text-rose-400" />
              <span>Accuracy: ±{telemetry.accuracyMeters}m</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-medium">Real-time Device GPS Active</span>
          </div>
        </div>

        <InteractiveMap
          lat={telemetry.lat}
          lng={telemetry.lng}
          address={telemetry.address}
          accuracyMeters={telemetry.accuracyMeters}
          isSharing={telemetry.isSharingActive}
          geofences={geofences}
          height="450px"
        />

        {/* Telemetry Detail Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Latitude</p>
            <p className="text-sm font-bold text-white font-mono">{telemetry.lat.toFixed(5)}° N</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Longitude</p>
            <p className="text-sm font-bold text-white font-mono">{telemetry.lng.toFixed(5)}° E</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Est. Movement Speed</p>
            <p className="text-sm font-bold text-teal-400 font-mono">{telemetry.speedKmh} km/h</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Device Battery</p>
            <p className="text-sm font-bold text-emerald-400 font-mono">{telemetry.batteryLevel}%</p>
          </div>
        </div>

      </div>

      {/* Geofence Safe Zones Management */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>Geofenced Safe Zones ({geofences.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated alerts are triggered if you exit a designated safe boundary</p>
          </div>

          <button
            onClick={() => setShowGeofenceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Safe Zone</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {geofences.map((zone) => (
            <div key={zone.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{zone.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {zone.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Radius: {zone.radiusMeters} meters • Alert on exit: {zone.alertOnExit ? 'Yes' : 'No'}
                </p>
              </div>

              <button
                onClick={() => deleteGeofence(zone.id)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Safe Zone"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Share Link Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-rose-400" />
                <span>Share Secure Live Location</span>
              </h3>
              <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Anyone with this encrypted link can monitor your live GPS coordinates until location sharing is turned off.
            </p>

            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="bg-transparent text-xs text-rose-300 font-mono flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              Sharing active with {trustedContacts.length} trusted contacts via automated SMS alerts.
            </div>
          </div>
        </div>
      )}

      {/* Add Geofence Modal */}
      {showGeofenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span>Create Safe Zone</span>
              </h3>
              <button onClick={() => setShowGeofenceModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddGeofence} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Safe Zone Name
                </label>
                <input
                  type="text"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  placeholder="e.g. University Campus Block B"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={zoneCategory}
                  onChange={(e) => setZoneCategory(e.target.value as any)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                >
                  <option value="college">University / College</option>
                  <option value="home">Home / Residence</option>
                  <option value="work">Office / Workplace</option>
                  <option value="other">Other Safe Hub</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Boundary Radius (Meters)
                </label>
                <input
                  type="number"
                  value={zoneRadius}
                  onChange={(e) => setZoneRadius(Number(e.target.value))}
                  min={100}
                  max={2000}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGeofenceModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg"
                >
                  Save Safe Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
