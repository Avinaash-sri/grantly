import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ArrowRight, 
  Scale, 
  Check, 
  Plus, 
  Clock, 
  MapPin
} from 'lucide-react';

export const ComparisonDrawer: React.FC = () => {
  const { 
    comparisonList, 
    toggleComparison, 
    clearComparison, 
    isComparisonOpen, 
    setIsComparisonOpen, 
    scholarships, 
    addApplication, 
    applications,
    setSelectedScholarship 
  } = useApp();

  const comparedScholarships = scholarships.filter((s) => comparisonList.includes(s.id));

  // Floating trigger bar when items are selected
  if (!isComparisonOpen) {
    if (comparisonList.length === 0) return null;

    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 border border-[#C5A880]/40">
        <div className="flex items-center gap-2 text-xs font-mono">
          <Scale className="w-4 h-4 text-[#C5A880]" />
          <span>{comparisonList.length} of 3 Endowments Selected</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3 py-1 bg-[#2C4E6F] text-white text-xs font-mono uppercase tracking-wider rounded-full hover:bg-[#233E59] transition-colors flex items-center gap-1"
          >
            <span>Compare Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearComparison}
            className="p-1 text-[#7E8B99] hover:text-[#F7F5F0] dark:hover:text-[#12161A]"
            title="Clear comparison"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Full Comparison Modal Dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#1B2129] flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#C5A880] font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>SIDE-BY-SIDE ENDOWMENT COMPARISON</span>
            </div>
            <h2 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
              Comparative Evaluation Matrix.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearComparison}
              className="text-xs font-mono text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0]"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="p-2 text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-x-auto flex-1">
          {comparedScholarships.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#7E8B99] font-mono">
              No scholarships currently queued for comparison. Select 2 or 3 grants from the discovery catalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[700px]">
              {comparedScholarships.map((sch) => {
                const isTracking = applications.some((a) => a.scholarshipId === sch.id);

                return (
                  <div
                    key={sch.id}
                    className="p-5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded flex flex-col justify-between space-y-6 paper-glow relative"
                  >
                    <button
                      onClick={() => toggleComparison(sch.id)}
                      className="absolute top-4 right-4 text-[#7E8B99] hover:text-red-500 transition-colors p-1"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-4 pr-6">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#7E8B99]">
                          {sch.institution}
                        </span>
                        <h4 
                          onClick={() => {
                            setIsComparisonOpen(false);
                            setSelectedScholarship(sch);
                          }}
                          className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0] hover:text-[#2C4E6F] cursor-pointer transition-colors leading-snug mt-1"
                        >
                          {sch.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs font-mono text-[#7E8B99] mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{sch.location} ({sch.country})</span>
                        </div>
                      </div>

                      {/* Criteria Metric Stack */}
                      <div className="space-y-3 pt-3 border-t border-[#E5E0D4] dark:border-[#2A3340] text-xs font-mono">
                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Award Value
                          </span>
                          <span className="font-serif text-lg font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
                            {sch.amountFormatted}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Coverage Scope
                          </span>
                          <span className="text-[#12161A] dark:text-[#F7F5F0] font-medium">
                            {sch.coverage}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Min Cumulative GPA
                          </span>
                          <span className="text-[#12161A] dark:text-[#F7F5F0] font-medium">
                            {sch.minGPA.toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Acceptance Rate & Quota
                          </span>
                          <span className="text-[#12161A] dark:text-[#F7F5F0] font-medium">
                            {sch.acceptanceRate} ({sch.annualQuota})
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Financial Need Policy
                          </span>
                          <span className="text-[#12161A] dark:text-[#F7F5F0] font-medium">
                            {sch.financialNeed}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Application Deadline
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {sch.deadline} ({sch.deadlineDaysRemaining}d remaining)
                          </span>
                        </div>

                        <div>
                          <span className="text-[#7E8B99] uppercase text-[10px] block">
                            Application Fee
                          </span>
                          <span className="text-[#12161A] dark:text-[#F7F5F0] font-medium">
                            {sch.applicationFee}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] space-y-2">
                      <button
                        onClick={() => {
                          addApplication(sch.id);
                        }}
                        disabled={isTracking}
                        className={`w-full py-2 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors ${
                          isTracking
                            ? 'bg-[#EBF1F7] dark:bg-[#1A2633] text-[#2C4E6F] dark:text-[#5C88B5]'
                            : 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] hover:bg-[#2C4E6F]'
                        }`}
                      >
                        {isTracking ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        <span>{isTracking ? 'Tracked in Portfolio' : 'Track Application'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsComparisonOpen(false);
                          setSelectedScholarship(sch);
                        }}
                        className="w-full py-2 text-xs font-medium border border-[#D1C9BC] dark:border-[#384556] rounded text-center hover:bg-[#F3EFE7] dark:hover:bg-[#161B22] transition-colors"
                      >
                        Inspect Full Dossier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3EFE7] dark:bg-[#1B2129] border-t border-[#E5E0D4] dark:border-[#2A3340] flex justify-end">
          <button
            onClick={() => setIsComparisonOpen(false)}
            className="px-5 py-2 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded text-xs font-mono uppercase tracking-wider font-semibold"
          >
            Close Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
