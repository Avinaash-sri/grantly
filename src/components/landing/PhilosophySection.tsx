import React from 'react';
import { ShieldCheck, Compass, FileCheck } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="py-24 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#FAF8F5] dark:bg-[#0F1216]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#C5A880] block mb-2">
              ESSAY & MANIFESTO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0] leading-snug">
              The Architecture of Collegiate Endowments.
            </h2>
          </div>
          <div className="lg:col-span-8 lg:pl-8 lg:border-l border-[#E5E0D4] dark:border-[#2A3340] space-y-4">
            <p className="text-base text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              Every year, over <span className="font-semibold text-[#12161A] dark:text-[#F7F5F0]">$120 million</span> in private academic endowments and philanthropic graduate fellowships go unallocated or under-subscribed. The modern scholarship ecosystem has been degraded by click-arbitrage portals, SEO scrapers, and speculative AI lists that publish expired deadlines and fabricated criteria.
            </p>
            <p className="text-base text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              GRANTLY was established under a singular premise: <span className="italic text-[#12161A] dark:text-[#F7F5F0]">funding exceptional talent requires institutional precision.</span> We treat scholarship discovery not as an ad-supported search engine, but as an editorial portfolio management system governed by strict deterministic rules.
            </p>
          </div>
        </div>

        {/* 3 Editorial Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar I */}
          <div className="p-8 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-4 hover:border-[#C5A880]/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A880]">PILLAR I</span>
              <ShieldCheck className="w-5 h-5 text-[#2C4E6F] dark:text-[#5C88B5]" />
            </div>
            <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
              Deterministic Matching
            </h3>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              We never guess or approximate eligibility through generic LLM summaries. Every grant in our repository is modeled as a deterministic rule matrix: strict GPA thresholds, verified degree pathways, and explicit geographic prerequisites.
            </p>
          </div>

          {/* Pillar II */}
          <div className="p-8 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-4 hover:border-[#C5A880]/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A880]">PILLAR II</span>
              <Compass className="w-5 h-5 text-[#2C4E6F] dark:text-[#5C88B5]" />
            </div>
            <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
              Institutional Parity
            </h3>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              Whether you are applying for Oxford's Rhodes Trust or the DAAD Climate Fellowship, requirements and application dossiers are laid out with total transparency. No paid placements, no sponsored promotions.
            </p>
          </div>

          {/* Pillar III */}
          <div className="p-8 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-4 hover:border-[#C5A880]/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#C5A880]">PILLAR III</span>
              <FileCheck className="w-5 h-5 text-[#2C4E6F] dark:text-[#5C88B5]" />
            </div>
            <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
              Synchronized Execution
            </h3>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              Discovery is only the preliminary step. GRANTLY provides an integrated application Kanban board, milestone checklists, and deadline countdowns so that recommendation letters and essays are delivered flawlessly.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
