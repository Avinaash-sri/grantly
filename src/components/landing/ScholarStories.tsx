import React from 'react';
import { SCHOLAR_TESTIMONIALS } from '../../data/mockProfile';
import { Quote, CheckCircle2 } from 'lucide-react';

export const ScholarStories: React.FC = () => {
  return (
    <section className="py-24 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#12161A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono tracking-widest uppercase text-[#C5A880] block">
            SCHOLAR OUTCOMES & DISPATCHES
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
            Voices from the Collegiate Trust Network.
          </h2>
          <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC]">
            Reflections from recipients of verified private endowments, global doctoral fellowships, and university trusts.
          </p>
        </div>

        {/* 3 Testimonials in Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SCHOLAR_TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-8 flex flex-col justify-between space-y-6 paper-glow"
            >
              <div className="space-y-4">
                <Quote className="w-6 h-6 text-[#C5A880]/70" />
                <p className="font-serif text-base text-[#12161A] dark:text-[#F7F5F0] italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5E0D4] dark:border-[#2A3340] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#12161A] dark:text-[#F7F5F0]">
                    {item.author}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Scholar</span>
                  </div>
                </div>

                <div className="text-xs text-[#7E8B99] dark:text-[#7A8796] space-y-0.5">
                  <p className="font-mono text-[#2C4E6F] dark:text-[#5C88B5] font-medium">
                    {item.grantReceived} ({item.amount})
                  </p>
                  <p>{item.role} • {item.institution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

