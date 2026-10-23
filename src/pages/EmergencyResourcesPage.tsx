import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, Search, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { emergencyResources } from '../mockData';

export const EmergencyResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = emergencyResources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm);
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
          <PhoneCall className="w-7 h-7 text-rose-400" />
          <span>Emergency Helplines & Resources</span>
        </h1>
        <p className="text-xs text-slate-400">Verified official direct emergency numbers, cyber crime desks & support services</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search police, women helpline, ambulance, cyber crime..."
            className="w-full py-3 pl-10 pr-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-rose-500"
        >
          <option value="all">All Categories</option>
          <option value="police">Police Dispatch</option>
          <option value="helpline">Women Helplines</option>
          <option value="cyber">Cyber Crime</option>
          <option value="ambulance">Medical / Ambulance</option>
        </select>
      </div>

      {/* Helplines Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {res.operatingHours}
                  </span>
                  <h3 className="text-base font-black text-white mt-1">{res.title}</h3>
                  <p className="text-xs text-slate-400">{res.subtitle}</p>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{res.description}</p>
            </div>

            {/* Direct Dial Action Box */}
            <a
              href={`tel:${res.phone}`}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-extrabold text-sm flex items-center justify-between shadow-xl transition-all transform active:scale-95"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5" />
                <span>Call Hotline ({res.phone})</span>
              </div>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};
