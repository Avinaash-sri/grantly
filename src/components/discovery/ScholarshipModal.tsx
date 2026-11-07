import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Bookmark, 
  Plus, 
  Check, 
  Clock, 
  ExternalLink, 
  FileText, 
  CheckCircle2
} from 'lucide-react';

export const ScholarshipModal: React.FC = () => {
  const { 
    selectedScholarship, 
    setSelectedScholarship, 
    toggleBookmark, 
    isBookmarked, 
    addApplication, 
    applications 
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedScholarship(null);
      }
    };
    if (selectedScholarship) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedScholarship, setSelectedScholarship]);

  if (!selectedScholarship) return null;

  const sch = selectedScholarship;
  const bookmarked = isBookmarked(sch.id);
  const isTracking = applications.some((a) => a.scholarshipId === sch.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Modal Masthead Header */}
        <div className="p-6 sm:p-8 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#1B2129] relative">
          <button
            onClick={() => setSelectedScholarship(null)}
            className="absolute top-6 right-6 p-2 text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] rounded border border-transparent hover:border-[#E5E0D4] dark:border-[#2A3340] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-12 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#C5A880] font-semibold">
                {sch.institution}
              </span>
              <span className="text-[#7E8B99]">•</span>
              <span className="text-xs font-mono text-[#7E8B99] dark:text-[#7A8796] flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {sch.location} ({sch.country})
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-[#12161A] dark:text-[#F7F5F0] leading-snug">
              {sch.title}
            </h2>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
              <span className="text-xl font-bold font-serif text-[#2C4E6F] dark:text-[#5C88B5]">
                {sch.amountFormatted}
              </span>
              <span className="px-2 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] text-[#12161A] dark:text-[#F7F5F0] rounded">
                {sch.coverage}
              </span>
              <span className="text-[#7E8B99]">
                Annual Quota: {sch.annualQuota}
              </span>
              <span className="text-[#7E8B99]">
                Acceptance: {sch.acceptanceRate}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] font-semibold">
              Endowment Description & Mandate
            </h4>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              {sch.description}
            </p>
          </div>

          {/* Key Eligibility Rules */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] font-semibold">
                Deterministic Eligibility Criteria
              </h4>
              <span className="text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
                Min Cumulative GPA: {sch.minGPA}
              </span>
            </div>

            <div className="bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded p-4 space-y-2.5">
              {sch.eligibilityCriteria.map((criterion, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                  <CheckCircle2 className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5] shrink-0 mt-0.5" />
                  <span>{criterion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] font-semibold">
              Required Application Portfolio Materials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sch.requiredDocuments.map((doc, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-xs text-[#4A5562] dark:text-[#B6C0CC] flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-[#C5A880] shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics: Fee, Deadline & Official Portal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] text-xs font-mono">
            <div>
              <span className="text-[#7E8B99] dark:text-[#7A8796] block uppercase">
                Application Fee
              </span>
              <span className="text-[#12161A] dark:text-[#F7F5F0] font-semibold">
                {sch.applicationFee}
              </span>
            </div>

            <div>
              <span className="text-[#7E8B99] dark:text-[#7A8796] block uppercase">
                Admissions Deadline
              </span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {sch.deadline} ({sch.deadlineDaysRemaining} days)
              </span>
            </div>

            <div>
              <span className="text-[#7E8B99] dark:text-[#7A8796] block uppercase">
                Verified Portal
              </span>
              <a 
                href={sch.officialLink} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#2C4E6F] dark:text-[#5C88B5] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Institutional Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-6 bg-[#F3EFE7] dark:bg-[#1B2129] border-t border-[#E5E0D4] dark:border-[#2A3340] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => toggleBookmark(sch.id)}
            className={`w-full sm:w-auto px-4 py-2.5 text-xs font-medium rounded border transition-colors flex items-center justify-center gap-2 ${
              bookmarked
                ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                : 'bg-white dark:bg-[#161B22] text-[#4A5562] dark:text-[#B6C0CC] border-[#E5E0D4] dark:border-[#2A3340]'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{bookmarked ? 'Saved in Dossier' : 'Save to Dossier'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={sch.officialLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium border border-[#D1C9BC] dark:border-[#384556] rounded text-[#12161A] dark:text-[#F7F5F0] hover:bg-white dark:hover:bg-[#161B22] text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Visit Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                addApplication(sch.id);
                setSelectedScholarship(null);
              }}
              disabled={isTracking}
              className={`w-full sm:w-auto px-5 py-2.5 text-xs font-medium rounded flex items-center justify-center gap-2 transition-colors ${
                isTracking
                  ? 'bg-[#EBF1F7] dark:bg-[#1A2633] text-[#2C4E6F] dark:text-[#5C88B5] border border-[#2C4E6F]/30 cursor-default'
                  : 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] hover:bg-[#2C4E6F]'
              }`}
            >
              {isTracking ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tracking in Portfolio</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Application Kanban</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
