import React, { Suspense, lazy } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Sparkles, Shield, Award, Landmark } from 'lucide-react';

const AcademicCanvas = lazy(() =>
  import('../3d/AcademicCanvas').then((mod) => ({ default: mod.AcademicCanvas }))
);

export const HeroSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-6 pb-12 border-b border-[#E5E0D4] dark:border-[#2A3340] overflow-hidden">
      {/* Background Subtle Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.04]">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#12161A 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Expressive Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 z-10">
            {/* Top Tag / Issue Volume */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono tracking-wider uppercase text-[#2C4E6F] dark:text-[#5C88B5]">
              <Landmark className="w-3.5 h-3.5" />
              <span>THE SCHOLAR CAPITAL DIRECTORY • VOL. 2026/2027</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal tracking-tight text-[#12161A] dark:text-[#F7F5F0] leading-[1.08]">
              Capitalizing <br />
              <span className="italic font-normal text-[#2C4E6F] dark:text-[#5C88B5]">Academic Ambition</span> <br />
              at Global Scale.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#4A5562] dark:text-[#B6C0CC] max-w-xl font-normal leading-relaxed">
              GRANTLY is an editorial-grade endowment repository and deterministic matching engine. 
              We connect exceptional undergraduate, postgraduate, and doctoral researchers directly to over 
              <span className="font-semibold text-[#12161A] dark:text-[#F7F5F0]"> $42.6M </span> 
              in verified collegiate trusts and foundation grants.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  setCurrentView('wizard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] font-medium text-sm rounded hover:bg-[#2C4E6F] dark:hover:bg-[#EBE5D9] transition-all flex items-center justify-center gap-2.5 shadow-sm group"
              >
                <Sparkles className="w-4 h-4 text-[#C5A880] group-hover:rotate-12 transition-transform" />
                <span>Calculate Eligibility Index</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('discovery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-transparent border border-[#D1C9BC] dark:border-[#384556] text-[#12161A] dark:text-[#F7F5F0] font-medium text-sm rounded hover:bg-[#F3EFE7] dark:hover:bg-[#161B22] transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse Discovery Catalog</span>
              </button>
            </div>

            {/* Assurance Trust Marks */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-[#7E8B99] dark:text-[#7A8796]">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#2C4E6F] dark:text-[#5C88B5]" />
                <span>Deterministic Rules</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Zero Data Monetization</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>100% Direct Application Links</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div className="lg:col-span-5 h-[380px] sm:h-[460px] lg:h-[520px] relative w-full flex items-center justify-center">
            {/* Soft decorative background glow */}
            <div className="absolute inset-0 bg-[#EBE5D9]/40 dark:bg-[#1A2633]/30 rounded-2xl filter blur-3xl -z-10 transform scale-90"></div>
            
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center bg-[#F3EFE7]/40 dark:bg-[#161B22]/40 rounded border border-[#E5E0D4] dark:border-[#2A3340]">
                  <div className="text-center font-mono text-xs text-[#7E8B99] animate-pulse">
                    RENDERING 3D ACADEMIC FOLIO...
                  </div>
                </div>
              }
            >
              <AcademicCanvas />
            </Suspense>

            {/* Interactive hint overlay */}
            <div className="absolute bottom-2 right-4 pointer-events-none text-[10px] font-mono tracking-widest uppercase text-[#7E8B99] dark:text-[#7A8796] bg-[#FAF8F5]/80 dark:bg-[#0F1216]/80 px-2.5 py-1 rounded border border-[#E5E0D4] dark:border-[#2A3340]">
              Interactive 3D Folio • Move Mouse
            </div>
          </div>

        </div>
      </div>

      {/* Key Metric Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 pt-8 border-t border-[#E5E0D4] dark:border-[#2A3340]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
              Verified Capital Pool
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#12161A] dark:text-[#F7F5F0]">
              $42.6 Million
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Across 14 institutional trusts
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
              Match Precision
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C4E6F] dark:text-[#5C88B5]">
              94.8%
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Deterministic rule verification
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
              Active Deadlines
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#C5A880]">
              Autumn 2026
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Rolling global admissions
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
              Application Cost
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#12161A] dark:text-[#F7F5F0]">
              $0 Platform Fee
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Unrestricted scholar access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
