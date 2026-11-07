import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, addToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Invalid Email', 'Please provide a valid institutional or personal email.', 'warning');
      return;
    }
    setSubscribed(true);
    addToast('Subscription Confirmed', 'You are now subscribed to The Endowment Dispatch.', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#F3EFE7] dark:bg-[#0B0E12] border-t border-[#E5E0D4] dark:border-[#242C37] mt-24 text-[#4A5562] dark:text-[#B6C0CC] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#E5E0D4] dark:border-[#242C37]">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] flex items-center justify-center font-serif font-bold text-base">
                G
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-[#12161A] dark:text-[#F7F5F0]">
                GRANTLY
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#7E8B99] dark:text-[#7A8796] pr-4">
              An independent academic endowment repository and deterministic grant intelligence system. 
              Connecting exceptional global scholars with fully funded collegiate trusts, foundation grants, 
              and doctoral research stipends.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Institutional Governance & Zero-Broker Integrity</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#12161A] dark:text-[#F7F5F0] font-semibold">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setCurrentView('discovery'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#12161A] dark:hover:text-[#F7F5F0] transition-colors"
                >
                  Scholarship Index
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('wizard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#12161A] dark:hover:text-[#F7F5F0] transition-colors"
                >
                  Eligibility Engine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#12161A] dark:hover:text-[#F7F5F0] transition-colors"
                >
                  Scholar Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setCurrentView('applications'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#12161A] dark:hover:text-[#F7F5F0] transition-colors"
                >
                  Application Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Endowments */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#12161A] dark:text-[#F7F5F0] font-semibold">
              Trusts & Grants
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1">
                <span>The Rhodes Trust</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Knight-Hennessy</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Gates Cambridge</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Turing AI Fellowship</span>
              </li>
              <li className="flex items-center gap-1">
                <span>Soros Fellowships</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Dispatch Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#12161A] dark:text-[#F7F5F0] font-semibold">
              The Endowment Dispatch
            </h4>
            <p className="text-xs text-[#7E8B99] dark:text-[#7A8796]">
              Fortnightly briefings on newly chartered collegiate grants, foundation application windows, and doctoral allocations.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#EBF1F7] dark:bg-[#1A2633] border border-[#2C4E6F]/30 rounded text-xs text-[#2C4E6F] dark:text-[#5C88B5] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription recorded for upcoming volume.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@institution.edu"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded-l text-[#12161A] dark:text-[#F7F5F0] placeholder:text-[#7E8B99] focus:outline-none focus:border-[#2C4E6F]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-[#2C4E6F] hover:bg-[#233E59] text-white text-xs font-medium rounded-r flex items-center justify-center transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#7E8B99] dark:text-[#7A8796] gap-4">
          <div>
            © 2026 GRANTLY ACADEMIC TRUST CORP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>DETERMINISTIC EVALUATION ENGINE V2.4</span>
            <span>•</span>
            <span>ZERO PRIVACY TRACKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

