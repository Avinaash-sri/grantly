import React, { Suspense, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Grid3x3, Sparkles } from 'lucide-react';
import { ScholarshipCard } from '../discovery/ScholarshipCard';

const OpportunityUniverse = React.lazy(() => import('../3d/OpportunityUniverse'));

export const UniverseView: React.FC = () => {
  const { scholarships, setSelectedScholarship } = useApp();
  const [mode, setMode] = useState<'universe' | 'grid'>('universe');

  const isTouch = typeof window !== 'undefined' &&
    (('ontouchstart' in window) || navigator.maxTouchPoints > 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0F1216] transition-colors">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>OPPORTUNITY UNIVERSE</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              Explore the Scholarship Universe.
            </h1>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] mt-1">
              {scholarships.length} verified endowments mapped in three-dimensional space. Click any node to explore.
            </p>
          </div>
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm">
            <button
              onClick={() => setMode('universe')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                mode === 'universe'
                  ? 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A]'
                  : 'text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>3D Universe</span>
            </button>
            <button
              onClick={() => setMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                mode === 'grid'
                  ? 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A]'
                  : 'text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
              }`}
            >
              <Grid3x3 className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {mode === 'universe' && !isTouch ? (
        <div className="w-full h-[70vh] relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#F3EFE7]/30 dark:bg-[#161B22]/30">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-[#7E8B99] uppercase tracking-wider">
                    Rendering Scholarship Universe…
                  </p>
                </div>
              </div>
            }
          >
            <OpportunityUniverse
              scholarships={scholarships}
              onSelectScholarship={setSelectedScholarship}
            />
          </Suspense>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isTouch && mode === 'universe' && (
            <div className="mb-6 p-4 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm text-sm text-[#4A5562] dark:text-[#B6C0CC] font-mono">
              3D Universe is optimized for desktop. Showing accessible grid view.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {scholarships.map((sch) => (
              <ScholarshipCard key={sch.id} scholarship={sch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

