import React, { useState } from 'react';
import { ShieldAlert, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onNavigateSignup: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateSignup }) => {
  const { setUser, user } = useSafety();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [emailInput, setEmailInput] = useState('ananya.sharma@example.com');
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');
  const [passwordInput, setPasswordInput] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, isLoggedIn: true }));
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/20 blur-[80px] rounded-full pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-600/30">
            <ShieldAlert className="w-6 h-6 fill-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to access your SafeHer safety monitoring dashboard</p>
        </div>

        {/* Auth Method Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAuthMethod('email')}
            className={`py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'email' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>

          <button
            onClick={() => setAuthMethod('phone')}
            className={`py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'phone' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Mobile Phone</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMethod === 'email' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Password / Emergency PIN
              </label>
              <span className="text-[10px] text-rose-400 hover:underline cursor-pointer">
                Forgot PIN?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full py-3 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In to SafeHer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Pre-filled Demo Credential Box */}
        <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-center space-y-1">
          <p className="text-[10px] font-extrabold uppercase text-rose-400 tracking-wider flex items-center justify-center gap-1">
            <KeyRound className="w-3 h-3" />
            <span>Demo Test Credentials</span>
          </p>
          <p className="text-xs text-slate-300 font-mono">
            User: ananya.sharma@example.com | PIN: 1234
          </p>
        </div>

        {/* Bottom Link */}
        <p className="text-xs text-center text-slate-400">
          Don't have a SafeHer account?{' '}
          <button
            onClick={onNavigateSignup}
            className="text-rose-400 font-bold hover:underline"
          >
            Create Free Account
          </button>
        </p>

      </div>
    </div>
  );
};
