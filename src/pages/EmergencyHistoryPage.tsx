import React, { useState } from 'react';
import { History, Download, MapPin, CheckCircle2, AlertTriangle, FileText, Calendar, Filter } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { EmergencyEvent } from '../types';
import { InteractiveMap } from '../components/common/InteractiveMap';

export const EmergencyHistoryPage: React.FC = () => {
  const { emergencyHistory } = useSafety();
  const [filter, setFilter] = useState<'all' | 'resolved' | 'active'>('all');
  const [selectedEvent, setSelectedEvent] = useState<EmergencyEvent | null>(null);

  const filtered = emergencyHistory.filter((e) => {
    if (filter === 'all') return true;
    return e.status === filter;
  });

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(emergencyHistory, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SafeHer_Incident_Report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <History className="w-7 h-7 text-rose-400" />
            <span>Emergency Incident History</span>
          </h1>
          <p className="text-xs text-slate-400">Complete audit log of triggered SOS alerts, check-in timeouts & resolutions</p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-rose-400" />
          <span>Export Official Report</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
            filter === 'all' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Incidents ({emergencyHistory.length})
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
            filter === 'resolved' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Event Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-400 rounded-3xl border border-slate-800">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No emergency incidents found.</p>
            <p className="text-xs text-slate-500 mt-1">When SOS alerts are triggered, logs will appear here.</p>
          </div>
        ) : (
          filtered.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setSelectedEvent(evt)}
              className="glass-card p-5 rounded-3xl border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    evt.status === 'active' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{evt.eventType}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(evt.triggeredAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    evt.status === 'active'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">GPS Location Snapshot</p>
                  <p className="text-xs text-slate-200">{evt.location.address}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>Incident Log: {selectedEvent.id}</span>
              </h3>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Event Type</span>
                  <p className="text-xs font-extrabold text-white">{selectedEvent.eventType}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Notified Contacts</span>
                  <p className="text-xs font-extrabold text-teal-400">{selectedEvent.notifiedContactsCount} Emergency Contacts</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Trigger Location Map</span>
                <InteractiveMap
                  lat={selectedEvent.location.lat}
                  lng={selectedEvent.location.lng}
                  address={selectedEvent.location.address}
                  accuracyMeters={selectedEvent.location.accuracyMeters}
                  isEmergency={false}
                  height="180px"
                />
              </div>

              {selectedEvent.cancellationReason && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <span className="text-[10px] text-rose-400 font-bold uppercase">Resolution Note</span>
                  <p className="mt-0.5">{selectedEvent.cancellationReason}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
