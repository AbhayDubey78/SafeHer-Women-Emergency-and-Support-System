import React, { useState } from 'react';
import { ShieldAlert, User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigateLogin: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess, onNavigateLogin }) => {
  const { setUser, addTrustedContact } = useSafety();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRelation, setContactRelation] = useState('Mother');

  const [pin, setPin] = useState('1234');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      phone: phone || prev.phone,
      emergencyPin: pin || '1234',
      isLoggedIn: true,
    }));

    if (contactName && contactPhone) {
      addTrustedContact({
        name: contactName,
        phone: contactPhone,
        email: '',
        relationship: contactRelation,
        isPrimary: true,
        notifySms: true,
        notifyCall: true,
        notifyApp: true,
        notifyEmail: true,
      });
    }

    onSignupSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
            <ShieldAlert className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Create SafeHer Account</h1>
          <p className="text-xs text-slate-400">Step {step} of 3 - Setup your emergency safety profile</p>
        </div>

        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between px-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-rose-500' : 'bg-slate-800'}`} />
          <div className="w-3" />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-rose-500' : 'bg-slate-800'}`} />
          <div className="w-3" />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-rose-500' : 'bg-slate-800'}`} />
        </div>

        {/* Step 1: User Details */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Emergency Contact</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Primary Emergency Contact */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <p className="text-xs text-slate-300 font-medium">
              Add your first primary emergency contact who will receive instant SMS & live location when SOS is activated.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Primary Contact Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Sunita Sharma (Mother)"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98111 22334"
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Relationship
              </label>
              <select
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Sister/Brother">Sister / Brother</option>
                <option value="Spouse/Partner">Spouse / Partner</option>
                <option value="Friend/Flatmate">Friend / Flatmate</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl"
              >
                Next: Setup PIN
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Security PIN Setup */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <p className="text-xs text-slate-300 font-medium">
              Create a 4-digit Security PIN. This PIN is used to deactivate emergency mode and verify your safety.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Create 4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-center font-mono text-xl tracking-[0.5em] focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Your profile, primary contact, and location permissions are ready!</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl"
              >
                Complete Account Setup
              </button>
            </div>
          </form>
        )}

        <p className="text-xs text-center text-slate-400">
          Already registered?{' '}
          <button onClick={onNavigateLogin} className="text-rose-400 font-bold hover:underline">
            Sign In Here
          </button>
        </p>

      </div>
    </div>
  );
};
