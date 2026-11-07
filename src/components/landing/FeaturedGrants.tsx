import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';

export const FeaturedGrants: React.FC = () => {
  const { 
    scholarships, 
    setSelectedScholarship, 
    toggleBookmark, 
    isBookmarked, 
    addApplication, 
    setCurrentView 
  } = useApp();

  const featured = scholarships.filter((s) => s.featured).slice(0, 3);
  const heroScholarship = featured[0];
  const sideScholarships = featured.slice(1);

  if (!heroScholarship) return null;

  return (
    <section className="py-24 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#FAF8F5] dark:bg-[#0F1216]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#C5A880] block mb-2">
              CURATED ENDOWMENT HIGHLIGHTS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              Featured Global Fellowships.
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('discovery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5] hover:underline mt-4 md:mt-0 flex items-center gap-1.5"
          >
            <span>View All 14 Fellowships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Asymmetrical 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Hero Card (Oxford Rhodes Trust) - Span 7 */}
          <div className="lg:col-span-7 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A880]/80 transition-all duration-200 paper-glow">
            <div>
              {/* Card Masthead */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#C5A880]/20 text-[#8C6B38] dark:text-[#E0C8A4] text-[10px] font-mono uppercase tracking-wider rounded mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>PREMIER ENDOWMENT SPOTLIGHT</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#12161A] dark:text-[#F7F5F0] leading-tight">
                    {heroScholarship.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7E8B99] dark:text-[#7A8796] mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{heroScholarship.institution} • {heroScholarship.location}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(heroScholarship.id);
                  }}
                  className={`p-2.5 rounded border transition-colors ${
                    isBookmarked(heroScholarship.id)
                      ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                      : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A]'
                  }`}
                  title="Save to Dossier"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Amount & Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
                    Total Funding
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#12161A] dark:text-[#F7F5F0]">
                    {heroScholarship.amountFormatted}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
                    Coverage Scope
                  </span>
                  <span className="text-xs font-mono font-medium text-[#2C4E6F] dark:text-[#5C88B5]">
                    {heroScholarship.coverage}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
                    Acceptance Rate
                  </span>
                  <span className="text-xs font-mono font-medium text-[#12161A] dark:text-[#F7F5F0]">
                    {heroScholarship.acceptanceRate} ({heroScholarship.annualQuota})
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] py-6 leading-relaxed">
                {heroScholarship.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pb-6">
                {heroScholarship.fields.slice(0, 3).map((f) => (
                  <span key={f} className="px-2.5 py-1 text-[11px] font-mono bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC] rounded">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-[#E5E0D4] dark:border-[#2A3340]">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#7E8B99] dark:text-[#7A8796]">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Deadline in {heroScholarship.deadlineDaysRemaining} days ({heroScholarship.deadline})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedScholarship(heroScholarship)}
                  className="px-4 py-2 text-xs font-medium bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded hover:bg-[#2C4E6F] transition-colors"
                >
                  View Full Dossier
                </button>
                <button
                  onClick={() => addApplication(heroScholarship.id)}
                  className="px-4 py-2 text-xs font-medium border border-[#D1C9BC] dark:border-[#384556] rounded hover:bg-white dark:hover:bg-[#1B2129] transition-colors"
                >
                  Track in Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 2 Staggered Cards - Span 5 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {sideScholarships.map((sch) => (
              <div 
                key={sch.id}
                className="bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 flex-1 flex flex-col justify-between hover:border-[#C5A880]/80 transition-all duration-200 paper-glow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#7E8B99] dark:text-[#7A8796]">
                        {sch.institution}
                      </span>
                      <h4 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0] leading-snug">
                        {sch.title}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(sch.id);
                      }}
                      className={`p-2 rounded border transition-colors ${
                        isBookmarked(sch.id)
                          ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                          : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A]'
                      }`}
                      title="Save to Dossier"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="font-serif text-lg font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
                      {sch.amountFormatted}
                    </span>
                    <span className="text-[11px] font-mono text-[#7E8B99] dark:text-[#7A8796]">
                      Min GPA: {sch.minGPA}
                    </span>
                  </div>

                  <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC] line-clamp-2 leading-relaxed">
                    {sch.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                    {sch.deadlineDaysRemaining} days remaining
                  </span>
                  <button
                    onClick={() => setSelectedScholarship(sch)}
                    className="text-xs font-mono uppercase text-[#2C4E6F] dark:text-[#5C88B5] hover:underline flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
