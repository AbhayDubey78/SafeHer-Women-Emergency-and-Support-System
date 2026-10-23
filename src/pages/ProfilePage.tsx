import React, { useState } from 'react';
import { User, Lock, Save, Shield, Heart, CheckCircle2, Phone, Mail } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useSafety();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [pin, setPin] = useState(user.emergencyPin);
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [allergies, setAllergies] = useState(user.allergies || '');
  const [medicalNotes, setMedicalNotes] = useState(user.medicalNotes || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      emergencyPin: pin,
      bloodGroup,
      allergies,
      medicalNotes,
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <User className="w-7 h-7 text-rose-400" />
          <span>Profile & Safety Settings</span>
        </h1>
        <p className="text-xs text-slate-400">Manage your personal info, emergency PIN, and first responder medical notes</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile and Emergency Security PIN updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Security PIN Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Emergency Security PIN</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              4-Digit Deactivation PIN
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-48 py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-center tracking-[0.5em] text-lg focus:outline-none focus:border-rose-500"
              required
            />
            <p className="text-[11px] text-slate-400">
              This 4-digit PIN is required to deactivate active Emergency SOS mode.
            </p>
          </div>
        </div>

        {/* First Responder Medical Notes */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Emergency First Responder Medical Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Allergies (If Any)
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Medical Notes for Paramedics
              </label>
              <input
                type="text"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="e.g. Asthma inhaler in handbag"
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>

    </div>
  );
};
