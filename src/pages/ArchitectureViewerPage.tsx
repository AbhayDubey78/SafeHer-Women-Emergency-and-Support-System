import React, { useState } from 'react';
import { Cpu, Database, Server, Layers, Code2, Copy, Check, Shield, Radio, Key } from 'lucide-react';

export const ArchitectureViewerPage: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'erd' | 'schemas' | 'api'>('erd');

  const sqlSchema = `-- ===================================================
-- SafeHer Database Schema Definition (PostgreSQL / MySQL)
-- ===================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    emergency_pin VARCHAR(4) NOT NULL DEFAULT '1234',
    blood_group VARCHAR(5),
    medical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trusted_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    notify_sms BOOLEAN DEFAULT TRUE,
    notify_call BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emergency_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL, -- 'SOS Button Triggered', 'Check-in Timeout'
    status VARCHAR(20) NOT NULL,    -- 'active', 'resolved', 'cancelled'
    initial_lat DECIMAL(10, 8) NOT NULL,
    initial_lng DECIMAL(11, 8) NOT NULL,
    initial_address TEXT,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

CREATE TABLE location_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emergency_event_id UUID REFERENCES emergency_events(id),
    user_id UUID NOT NULL REFERENCES users(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy_meters FLOAT NOT NULL,
    speed_kmh INT DEFAULT 0,
    battery_percentage INT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-extrabold uppercase tracking-wider mb-2 border border-rose-500/30">
          <Cpu className="w-4 h-4" />
          <span>System Design & Technical Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          SafeHer Architecture & Database ERD
        </h1>
        <p className="text-xs text-slate-400">
          Full technical specs, Entity Relationship Model, SQL schemas & REST API flow for evaluation
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('erd')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'erd' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture & ER Diagram</span>
        </button>

        <button
          onClick={() => setActiveTab('schemas')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'schemas' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>SQL Database Schemas</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'api' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>API Specifications</span>
        </button>
      </div>

      {/* Content for ERD & System Architecture */}
      {activeTab === 'erd' && (
        <div className="space-y-6">
          
          {/* Multi-Tier Architecture Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-teal-400" />
              <span>System Multi-Tier Architecture</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400">1. Client Layer</span>
                <h3 className="text-sm font-black text-white">React + PWA Client</h3>
                <p className="text-slate-400 leading-relaxed">
                  Responsive UI with Web Audio API synthesizer for siren alarms, Leaflet maps for live GPS tracks, and local storage fallback.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-400">2. Gateway & Services</span>
                <h3 className="text-sm font-black text-white">REST & WebSocket API</h3>
                <p className="text-slate-400 leading-relaxed">
                  Node.js / Express or Python FastAPI handling authentication JWTs, rate limiting, and real-time location websockets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-400">3. Dispatch Layer</span>
                <h3 className="text-sm font-black text-white">Twilio & FCM Gateway</h3>
                <p className="text-slate-400 leading-relaxed">
                  Multi-channel alert dispatcher triggering SMS, voice call auto-dialers, and Firebase push notifications to trusted contacts.
                </p>
              </div>
            </div>
          </div>

          {/* ER Diagram Representation Table */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-400" />
              <span>Entity Relationship (ER) Data Model Table</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Entity Name</th>
                    <th className="py-2.5 px-3">Primary Key</th>
                    <th className="py-2.5 px-3">Foreign Keys</th>
                    <th className="py-2.5 px-3">Core Attributes</th>
                    <th className="py-2.5 px-3">Relationships</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">USERS</td>
                    <td className="py-3 px-3 font-mono text-rose-400">id (UUID)</td>
                    <td className="py-3 px-3 text-slate-500">-</td>
                    <td className="py-3 px-3">name, email, phone, emergency_pin, blood_group</td>
                    <td className="py-3 px-3 text-teal-400">1:N TrustedContacts, 1:N Events</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">TRUSTED_CONTACTS</td>
                    <td className="py-3 px-3 font-mono text-rose-400">id (UUID)</td>
                    <td className="py-3 px-3 font-mono text-sky-400">user_id</td>
                    <td className="py-3 px-3">contact_name, phone, relationship, is_primary</td>
                    <td className="py-3 px-3 text-teal-400">N:1 Users</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">EMERGENCY_EVENTS</td>
                    <td className="py-3 px-3 font-mono text-rose-400">id (UUID)</td>
                    <td className="py-3 px-3 font-mono text-sky-400">user_id</td>
                    <td className="py-3 px-3">event_type, status, initial_lat, initial_lng</td>
                    <td className="py-3 px-3 text-teal-400">1:N LocationLogs</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-white">LOCATION_LOGS</td>
                    <td className="py-3 px-3 font-mono text-rose-400">id (UUID)</td>
                    <td className="py-3 px-3 font-mono text-sky-400">event_id, user_id</td>
                    <td className="py-3 px-3">latitude, longitude, accuracy, battery</td>
                    <td className="py-3 px-3 text-teal-400">N:1 EmergencyEvents</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SQL Schemas View */}
      {activeTab === 'schemas' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-rose-400" />
              <span>Production SQL DDL Statements</span>
            </h2>

            <button
              onClick={handleCopySql}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy Code'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-rose-300/90 overflow-x-auto leading-relaxed">
            {sqlSchema}
          </pre>
        </div>
      )}

      {/* API Specification */}
      {activeTab === 'api' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-teal-400" />
            <span>REST API Endpoint Specification</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-1 rounded bg-rose-600 text-white font-extrabold text-[10px]">POST</span>
              <div>
                <p className="font-mono font-bold text-white">/api/v1/sos/trigger</p>
                <p className="text-slate-400 mt-0.5">Triggers emergency mode, logs event, and dispatches SMS/Calls to contacts.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-1 rounded bg-emerald-600 text-white font-extrabold text-[10px]">POST</span>
              <div>
                <p className="font-mono font-bold text-white">/api/v1/sos/resolve</p>
                <p className="text-slate-400 mt-0.5">Verifies 4-digit security PIN and deactivates emergency active state.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-1 rounded bg-sky-600 text-white font-extrabold text-[10px]">PUT</span>
              <div>
                <p className="font-mono font-bold text-white">/api/v1/location/telemetry</p>
                <p className="text-slate-400 mt-0.5">Streams real-time GPS coordinates, speed, and device battery level.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
