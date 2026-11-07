import React, { useState, Suspense } from 'react';
import { useApp } from '../../context/AppContext';
import { FilterSidebar } from './FilterSidebar';
import { ScholarshipCard } from './ScholarshipCard';
import { ComparisonDrawer } from './ComparisonDrawer';
import {
  ArrowUpDown,
  RotateCcw,
  Bookmark,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

// Lazy-load 3D card – only loads if the user is on a non-touch device
const ScholarshipCard3D = React.lazy(() => import('../3d/ScholarshipCard3D'));

// Helper hook: enable 3D tilt cards on desktop with no reduced-motion preference
function useEnable3D() {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(!isTouch && !prefersReduced);
  }, []);
  return enabled;
}

export const DiscoveryView: React.FC = () => {
  const enable3D = useEnable3D();
  const {
    scholarships,
    filterState,
    setFilterState,
    resetFilters,
    bookmarks
  } = useApp();

  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter logic
  const filteredScholarships = scholarships.filter((s) => {
    if (showOnlyBookmarked && !bookmarks.includes(s.id)) return false;

    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      const matchTitle = s.title.toLowerCase().includes(q);
      const matchInst = s.institution.toLowerCase().includes(q);
      const matchLocation = s.location.toLowerCase().includes(q) || s.country.toLowerCase().includes(q);
      const matchField = s.fields.some((f) => f.toLowerCase().includes(q));
      const matchTag = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchInst && !matchLocation && !matchField && !matchTag) return false;
    }

    if (filterState.degree !== 'All Degrees') {
      if (!s.degreeLevels.includes(filterState.degree as any)) return false;
    }

    if (filterState.field !== 'All Fields') {
      if (!s.fields.includes(filterState.field) && !s.fields.includes('Interdisciplinary')) return false;
    }

    if (filterState.country !== 'All Locations') {
      if (filterState.country === 'Global') {
        if (s.country !== 'Global') return false;
      } else if (s.country !== filterState.country) {
        return false;
      }
    }

    if (filterState.coverage !== 'All Coverages') {
      if (s.coverage !== filterState.coverage) return false;
    }

    if (filterState.need !== 'All Financial Types') {
      if (s.financialNeed !== filterState.need) return false;
    }

    return true;
  });

  // Sorting logic
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (filterState.sortBy === 'deadline') return a.deadlineDaysRemaining - b.deadlineDaysRemaining;
    if (filterState.sortBy === 'amount-desc') return b.amount - a.amount;
    if (filterState.sortBy === 'amount-asc') return a.amount - b.amount;
    if (filterState.sortBy === 'popularity') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return 0;
  });

  return (
    <div className="min-h-screen py-10 bg-[#FAF8F5] dark:bg-[#0F1216] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Masthead Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>COLLEGIATE TRUST DIRECTORY</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              Endowment &amp; Fellowship Discovery.
            </h1>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] mt-1">
              Showing {sortedScholarships.length} of {scholarships.length} verified endowments worldwide.
            </p>
          </div>

          {/* Quick Pill Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`px-3 py-1.5 text-xs font-mono rounded border flex items-center gap-1.5 transition-colors ${
                showOnlyBookmarked
                  ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                  : 'bg-white dark:bg-[#161B22] border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Saved in Dossier ({bookmarks.length})</span>
            </button>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3 py-1.5 text-xs font-mono rounded border border-[#E5E0D4] dark:border-[#2A3340] bg-white dark:bg-[#161B22] text-[#12161A] dark:text-[#F7F5F0] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Sort & Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-[#7E8B99] dark:text-[#7A8796] uppercase text-[10px]">
              Preset Views:
            </span>
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, coverage: 'Full Tuition & Living' }))}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                filterState.coverage === 'Full Tuition & Living'
                  ? 'bg-[#2C4E6F] text-white'
                  : 'bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC]'
              }`}
            >
              Full Tuition &amp; Living
            </button>
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, field: 'Computer Science & AI' }))}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                filterState.field === 'Computer Science & AI'
                  ? 'bg-[#2C4E6F] text-white'
                  : 'bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC]'
              }`}
            >
              AI &amp; Tech
            </button>
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, country: 'United Kingdom' }))}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                filterState.country === 'United Kingdom'
                  ? 'bg-[#2C4E6F] text-white'
                  : 'bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC]'
              }`}
            >
              UK Trusts
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7E8B99]" />
            <span className="text-[#7E8B99] dark:text-[#7A8796] uppercase text-[10px]">Sort:</span>
            <select
              value={filterState.sortBy}
              onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-2.5 py-1 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-xs text-[#12161A] dark:text-[#F7F5F0] focus:outline-none"
            >
              <option value="deadline">Earliest Deadline</option>
              <option value="amount-desc">Funding (High to Low)</option>
              <option value="amount-asc">Funding (Low to High)</option>
              <option value="popularity">Spotlight Featured</option>
            </select>
          </div>
        </div>

        {/* Main Grid: Sidebar + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Filter Sidebar */}
          <div className={`lg:col-span-4 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar />
          </div>

          {/* Cards */}
          <div className="lg:col-span-8 space-y-6">
            {sortedScholarships.length === 0 ? (
              <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EBE5D9] dark:bg-[#242C37] text-[#7E8B99] flex items-center justify-center mx-auto">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                  No Endowments Match Your Current Filters.
                </h3>
                <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] max-w-md mx-auto">
                  We could not find any active verified grants matching these specific constraints. Try broadening your degree level or geographic preference.
                </p>
                <div>
                  <button
                    onClick={() => { resetFilters(); setShowOnlyBookmarked(false); }}
                    className="px-4 py-2 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded text-xs font-mono uppercase tracking-wider flex items-center gap-2 mx-auto hover:bg-[#2C4E6F] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedScholarships.map((sch) =>
                  enable3D ? (
                    <Suspense key={sch.id} fallback={<ScholarshipCard scholarship={sch} />}>
                      <ScholarshipCard3D scholarship={sch} />
                    </Suspense>
                  ) : (
                    <ScholarshipCard key={sch.id} scholarship={sch} />
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Comparison Drawer */}
        <ComparisonDrawer />
      </div>
    </div>
  );
};
