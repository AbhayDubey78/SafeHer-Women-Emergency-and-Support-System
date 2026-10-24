import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Star, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Mail
} from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { TrustedContact } from '../types';

export const TrustedContactsPage: React.FC = () => {
  const { 
    trustedContacts, 
    addTrustedContact, 
    updateTrustedContact, 
    deleteTrustedContact, 
    setPrimaryContact,
  } = useSafety();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('Mother');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setName('');
    setPhone('');
    setEmail('');
    setRelationship('Mother');
    setNotifyEmail(true);
    setFormError('');
    setEditingContact(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: TrustedContact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setRelationship(c.relationship);
    setNotifyEmail(c.notifyEmail !== false);
    setFormError('');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    let res;
    if (editingContact) {
      res = updateTrustedContact(editingContact.id, { 
        name, 
        phone, 
        email: email.trim(), 
        relationship,
        notifyEmail 
      });
    } else {
      res = addTrustedContact({
        name,
        phone,
        email: email.trim(),
        relationship,
        isPrimary: trustedContacts.length === 0,
        notifySms: true,
        notifyCall: true,
        notifyEmail,
        notifyApp: true,
      });
    }

    if (!res.success) {
      setFormError(res.error || 'Invalid contact details.');
    } else {
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-400" />
            <span>Trusted Contacts & First Responders</span>
          </h1>
          <p className="text-xs text-slate-400">
            Emergency contacts who receive automatic server-side SMS alerts and voice calls when SOS is activated
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
        <p className="font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Server-Side Automatic Telephony Dispatch</span>
        </p>
        <p>
          When Emergency SOS is triggered, the SafeHer backend server automatically dispatches SMS messages to all configured contacts and places a voice call to the Primary contact via Twilio.
        </p>
      </div>

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trustedContacts.map((contact: TrustedContact) => (
          <div
            key={contact.id}
            className={`glass-card p-5 rounded-3xl border transition-all space-y-4 ${
              contact.isPrimary ? 'border-rose-500/50 shadow-xl' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-rose-400 flex items-center justify-center font-black text-base border border-slate-700">
                    {contact.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{contact.name}</h3>
                    {contact.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <Star className="w-3 h-3 text-rose-400 fill-rose-400" />
                        <span>Primary</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">{contact.relationship} • {contact.phone}</p>
                  {contact.email ? (
                    <p className="text-[11px] text-sky-400 font-mono mt-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-400" />
                      <span>{contact.email}</span>
                      {contact.notifyEmail && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 text-[9px] font-bold">Email Alert ON</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">No email address configured</p>
                  )}
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(contact)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Edit Contact"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTrustedContact(contact.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                  title="Delete Contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Configured Status Badges */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-teal-400 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SMS & Call Active</span>
                </span>
                {contact.email && contact.notifyEmail && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sky-300" />
                    <span>Email Active</span>
                  </span>
                )}
              </div>

              {!contact.isPrimary && (
                <button
                  onClick={() => setPrimaryContact(contact.id)}
                  className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-[10px] border border-slate-800 transition-all flex items-center gap-1"
                >
                  <Star className="w-3 h-3 text-rose-400" />
                  <span>Set Primary</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-400" />
                <span>{editingContact ? 'Edit Contact Details' : 'Add Emergency Contact'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Contact Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sunita Sharma (Mother)"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Indian Phone Number (+91)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98111 22334 or 9811122334"
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Valid 10-digit Indian mobile number format</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address (For Emergency Email Alerts)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. contact@example.com"
                    className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Live Google Maps location coordinates will be sent to this email</p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister/Brother">Sister / Brother</option>
                  <option value="Spouse/Partner">Spouse / Partner</option>
                  <option value="Best Friend / Flatmate">Best Friend / Flatmate</option>
                  <option value="Guardian">Guardian</option>
                </select>
              </div>

              {/* Emergency Channels */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Emergency Channels</p>
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Send Emergency Email Alert (with live GPS link)</span>
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg"
                >
                  {editingContact ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
