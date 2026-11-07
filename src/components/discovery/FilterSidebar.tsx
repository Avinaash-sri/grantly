import React from 'react';
import { useApp } from '../../context/AppContext';
import { Filter, RotateCcw, Search, X } from 'lucide-react';

export const FilterSidebar: React.FC = () => {
  const { filterState, setFilterState, resetFilters, scholarships } = useApp();

  const degrees = [
    'All Degrees',
    'Undergraduate',
    "Master's",
    'Doctoral / PhD',
    'High School Senior'
  ];

  const fields = [
    'All Fields',
    'Computer Science & AI',
    'Engineering',
    'Biomedical Sciences',
    'Humanities & Law',
    'Economics & Business',
    'Environmental & Energy',
    'Interdisciplinary'
  ];

  const locations = [
    'All Locations',
    'United States',
    'United Kingdom',
    'European Union',
    'Asia-Pacific',
    'Global'
  ];

  const coverages = [
    'All Coverages',
    'Full Tuition & Living',
    'Full Tuition',
    'Research Fellowship',
    'Stipend & Travel'
  ];

  const needs = [
    'All Financial Types',
    'Need-Blind',
    'Need-Based',
    'Merit-Only',
    'Low-Income Priority'
  ];

  const activeFilterCount = [
    filterState.degree !== 'All Degrees',
    filterState.field !== 'All Fields',
    filterState.country !== 'All Locations',
    filterState.coverage !== 'All Coverages',
    filterState.need !== 'All Financial Types',
    Boolean(filterState.searchQuery)
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />
          <h3 className="font-serif text-lg font-medium text-[#12161A] dark:text-[#F7F5F0]">
            Filters & Criteria
          </h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#2C4E6F] text-white text-[10px] font-mono flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-mono text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-[#7E8B99] absolute left-3 top-2.5" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search title, university, field..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] placeholder:text-[#7E8B99] focus:outline-none focus:border-[#2C4E6F]"
          />
          {filterState.searchQuery && (
            <button
              onClick={() => setFilterState((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Target Degree Level */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Degree Target
        </label>
        <select
          value={filterState.degree}
          onChange={(e) => setFilterState((prev) => ({ ...prev, degree: e.target.value }))}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
        >
          {degrees.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Academic Discipline / Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Field of Study
        </label>
        <select
          value={filterState.field}
          onChange={(e) => setFilterState((prev) => ({ ...prev, field: e.target.value }))}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
        >
          {fields.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Geographic Location */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Host Territory / Country
        </label>
        <select
          value={filterState.country}
          onChange={(e) => setFilterState((prev) => ({ ...prev, country: e.target.value }))}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Funding Scope */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Funding Coverage
        </label>
        <select
          value={filterState.coverage}
          onChange={(e) => setFilterState((prev) => ({ ...prev, coverage: e.target.value }))}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
        >
          {coverages.map((cov) => (
            <option key={cov} value={cov}>
              {cov}
            </option>
          ))}
        </select>
      </div>

      {/* Financial Assessment */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
          Need Assessment
        </label>
        <select
          value={filterState.need}
          onChange={(e) => setFilterState((prev) => ({ ...prev, need: e.target.value }))}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
        >
          {needs.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Repository Status Meta */}
      <div className="pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] text-[11px] font-mono text-[#7E8B99] dark:text-[#7A8796] space-y-1">
        <div className="flex justify-between">
          <span>Active Endowments:</span>
          <span className="text-[#12161A] dark:text-[#F7F5F0]">{scholarships.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Rule Verification:</span>
          <span className="text-[#2C4E6F] dark:text-[#5C88B5]">Deterministic 100%</span>
        </div>
      </div>

    </div>
  );
};
