import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Lock, 
  MapPin, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Server,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';
import { InteractiveMap } from './InteractiveMap';

export const EmergencyActiveModal: React.FC = () => {
  const { 
    isEmergencyActive, 
    activeEvent, 
    sosBackendResponse,
    resolveEmergency, 
    telemetry, 
    trustedContacts,
    isSirenPlaying,
    toggleSiren,
  } = useSafety();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  if (!isEmergencyActive) return null;

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    const success = resolveEmergency(pinInput, cancelReason);
    if (!success) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
      setShowPinModal(false);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${telemetry.lat},${telemetry.lng}`;
  const activationTimestamp = activeEvent ? new Date(activeEvent.triggeredAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
  
  const isMsg91Configured = sosBackendResponse ? Boolean(sosBackendResponse.isMsg91Configured) : false;
  const isEmailConfigured = sosBackendResponse ? Boolean(sosBackendResponse.isEmailConfigured) : false;
  const isOverallSuccess = sosBackendResponse ? sosBackendResponse.success : false;

  const smsStatus = sosBackendResponse?.sms?.status;
  const smsError = sosBackendResponse?.sms?.error;
  const callStatus = sosBackendResponse?.call?.status;
  const callError = sosBackendResponse?.call?.error;
  const callSid = sosBackendResponse?.call?.sid;

  const emailStatus = sosBackendResponse?.email?.status;
  const emailError = sosBackendResponse?.email?.error;
  const emailSentCount = sosBackendResponse?.email?.sentCount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl text-white overflow-y-auto animate-fade-in">
      
      {/* Top Emergency Active Banner */}
      <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-700 px-4 py-3 shadow-lg flex items-center justify-between sticky top-0 z-20 border-b border-rose-500/30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-white/20 animate-ping">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider uppercase text-white">
                🔴 SOS ALERT ACTIVATED
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                smsStatus === 'sent' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white animate-pulse'
              }`}>
                {smsStatus === 'sent' ? 'MSG91 SMS DISPATCHED' : 'SMS CONFIGURATION REQUIRED'}
              </span>
            </div>
            <p className="text-[11px] text-rose-100 font-medium">
              Real device GPS broadcasting live coordinates
            </p>
          </div>
        </div>

        {/* Resolve PIN Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPinModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 font-extrabold text-xs shadow hover:bg-slate-100 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>I AM SAFE (PIN)</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Real Backend Delivery Status Card */}
        <div className={`glass-card p-5 rounded-3xl border-2 shadow-2xl space-y-4 ${
          smsStatus === 'sent' ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-rose-500/60 bg-rose-950/20'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${
                smsStatus === 'sent' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                <Server className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Backend SMS Delivery Status (MSG91)
                </p>
                <h3 className={`text-base font-black ${smsStatus === 'sent' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {smsStatus === 'sent'
                    ? 'Emergency SMS sent successfully.'
                    : 'SMS could not be sent. Please check your emergency contact and SMS configuration.'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleSiren}
                className={`px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 border transition-all ${
                  isSirenPlaying
                    ? 'bg-rose-600 text-white border-rose-400 animate-bounce shadow-lg shadow-rose-600/50'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
              >
                {isSirenPlaying ? <Volume2 className="w-4 h-4 animate-spin" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                <span>{isSirenPlaying ? 'STOP SIREN' : 'SOUND SIREN'}</span>
              </button>
            </div>
          </div>

          {/* Grid Indicators: Location, SMS, Call, Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            
            {/* 1. Location Indicator */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-extrabold">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>📍 GPS Location</span>
                </span>
                <span className="text-emerald-400 font-bold">Acquired</span>
              </div>
              <p className="font-mono text-white text-xs font-bold truncate">{telemetry.lat}, {telemetry.lng}</p>
              <p className="text-[10px] text-slate-400 truncate">Accuracy: ±{telemetry.accuracyMeters}m</p>
            </div>

            {/* 2. SMS Indicator (MSG91) */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-extrabold">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>📱 MSG91 SMS</span>
                </span>
                <span className={`font-bold ${smsStatus === 'sent' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {smsStatus === 'sent' ? '✅ Sent' : '❌ Failed'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200">
                {smsStatus === 'sent' 
                  ? `Emergency SMS sent successfully via MSG91.` 
                  : (smsError || 'SMS configuration required.')}
              </p>
            </div>

            {/* 3. Call Indicator (Twilio Voice) */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-extrabold">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>📞 Twilio Call</span>
                </span>
                <span className={`font-bold ${callStatus === 'initiated' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {callStatus === 'initiated' ? '✅ Initiated' : 'Optional'}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate">
                {callStatus === 'initiated' 
                  ? `Twilio Voice call active (SID: ${callSid?.substring(0, 8)}...)` 
                  : (callError || 'Twilio Voice Call optional')}
              </p>
            </div>

            {/* 4. Email Indicator */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-extrabold">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Mail className="w-3.5 h-3.5" />
                  <span>✉️ Email Alert</span>
                </span>
                <span className={`font-bold ${emailStatus === 'sent' ? 'text-emerald-400' : (isEmailConfigured ? 'text-rose-400' : 'text-amber-400')}`}>
                  {emailStatus === 'sent' ? '✅ Sent' : (isEmailConfigured ? '❌ Failed' : 'Unconfigured')}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 truncate">
                {emailStatus === 'sent' 
                  ? 'Emergency email sent via Web3Forms.' 
                  : (emailError || (isEmailConfigured ? 'Email dispatch failed' : 'Configure WEB3FORMS_ACCESS_KEY in .env'))}
              </p>
            </div>

          </div>

          {/* Configuration Warning Boxes */}
          {!isMsg91Configured && (
            <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold">MSG91 Credentials Missing in Backend `.env`</strong>
                <span>Set <code>MSG91_AUTH_KEY</code> in <code>.env</code> to send emergency SMS messages.</span>
              </div>
            </div>
          )}

          {!isEmailConfigured && (
            <div className="p-3 rounded-2xl bg-sky-950/80 border border-sky-500/40 text-sky-200 text-xs flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-bold">Email Dispatch Setup</strong>
                <span>To send emergency alert emails to contacts, configure <code>WEB3FORMS_ACCESS_KEY</code> in backend <code>.env</code>.</span>
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-800/80">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Emergency Trigger Timestamp: <strong>{activationTimestamp}</strong></span>
          </div>
        </div>

        {/* Live Location Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Live Location & Google Maps Link</span>
            </h4>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Open Google Maps Location Pin</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <InteractiveMap
            lat={telemetry.lat}
            lng={telemetry.lng}
            address={telemetry.address}
            accuracyMeters={telemetry.accuracyMeters}
            isEmergency={true}
            isSharing={true}
            height="260px"
          />
        </div>

        {/* Emergency Contacts Delivery Breakdown */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Emergency Contacts MSG91 Delivery Status ({trustedContacts.length})</span>
            </h4>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
              isMsg91Configured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {isMsg91Configured ? 'MSG91 API Active' : 'MSG91 Unconfigured'}
            </span>
          </div>

          <div className="space-y-3">
            {trustedContacts.map((contact) => {
              const res = sosBackendResponse?.results?.find((r) => r.contact === contact.name || r.phone === contact.phone);
              const status = res ? res.status : (isMsg91Configured ? 'sent' : 'failed');
              const error = res?.error || (!isMsg91Configured ? 'MSG91 credentials missing in backend .env' : undefined);
              const maskedPhone = res?.maskedPhone || contact.phone;

              return (
                <div key={contact.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-white">{contact.name}</p>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Primary (Auto Voice Call)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{contact.relationship} • {maskedPhone}</p>
                    {contact.email && (
                      <p className="text-[11px] text-sky-400 font-mono mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-sky-400" />
                        <span>{contact.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* SMS Status Badge */}
                    {status === 'sent' ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>✅ SMS Sent</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>❌ {error || 'SMS Failed'}</span>
                      </span>
                    )}

                    {/* Email Status Badge */}
                    {contact.email ? (
                      emailStatus === 'sent' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>✅ Email Sent</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{isEmailConfigured ? 'Email Pending' : 'Email Unconfigured'}</span>
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-slate-900 text-slate-500 text-[10px]">No Email</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Deactivate / Cancel Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => setShowPinModal(true)}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I AM SAFE - DEACTIVATE EMERGENCY</span>
          </button>

          <button
            onClick={() => setShowPinModal(true)}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm border border-slate-700 flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>Cancel SOS Alert (PIN)</span>
          </button>
        </div>

      </div>

      {/* PIN Verification Deactivation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-400" />
                <span>Deactivate Emergency SOS</span>
              </h3>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-300">
              Enter your 4-digit Security PIN to confirm that you are safe and deactivate emergency mode.
            </p>

            <form onSubmit={handleResolve} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  4-Digit Security PIN (Default: 1234)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="••••"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center tracking-[0.5em] text-xl focus:outline-none focus:border-rose-500"
                  required
                />
                {pinError && (
                  <p className="text-xs text-rose-400 font-semibold mt-1">
                    Incorrect Security PIN. Please try again or use default (1234).
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Resolution Note / Reason (Optional)
                </label>
                <input
                  type="text"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. False alarm / Safe at destination"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-slate-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
                >
                  CONFIRM SAFE & DEACTIVATE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
