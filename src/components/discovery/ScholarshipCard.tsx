import React, { useState } from 'react';
import { Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bookmark, 
  Clock, 
  MapPin, 
  Plus, 
  Check,
  Scale 
} from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { 
    setSelectedScholarship, 
    toggleBookmark, 
    isBookmarked, 
    addApplication, 
    applications,
    toggleComparison,
    isCompared
  } = useApp();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const bookmarked = isBookmarked(scholarship.id);
  const compared = isCompared(scholarship.id);
  const isTracking = applications.some((a) => a.scholarshipId === scholarship.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePos.y * 4}deg) rotateY(${mousePos.x * 4}deg) translateY(-2px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
      }}
      className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-7 flex flex-col justify-between hover:border-[#C5A880]/80 transition-colors duration-200 paper-glow relative group"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796]">
                {scholarship.institution}
              </span>
              {scholarship.featured && (
                <span className="px-1.5 py-0.2 bg-[#C5A880]/20 text-[#8C6B38] dark:text-[#E0C8A4] text-[9px] font-mono uppercase rounded">
                  Spotlight
                </span>
              )}
            </div>
            <h3 
              onClick={() => setSelectedScholarship(scholarship)}
              className="font-serif text-xl sm:text-2xl font-normal text-[#12161A] dark:text-[#F7F5F0] hover:text-[#2C4E6F] dark:hover:text-[#5C88B5] cursor-pointer transition-colors leading-snug"
            >
              {scholarship.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#7E8B99] dark:text-[#7A8796] mt-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{scholarship.location} • {scholarship.country}</span>
            </div>
          </div>

          {/* Action Buttons: Compare & Bookmark */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleComparison(scholarship.id);
              }}
              className={`p-2 rounded border transition-colors ${
                compared
                  ? 'bg-[#C5A880] text-[#12161A] border-[#C5A880]'
                  : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
              }`}
              title={compared ? 'In Comparison Matrix' : 'Compare Fellowship'}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(scholarship.id);
              }}
              className={`p-2 rounded border transition-colors ${
                bookmarked
                  ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                  : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340] hover:text-[#12161A] dark:hover:text-[#F7F5F0]'
              }`}
              title={bookmarked ? 'Saved to Dossier' : 'Save to Dossier'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Amount & Key Specs Matrix */}
        <div className="grid grid-cols-2 gap-3 py-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Funding Allocation
            </span>
            <span className="font-serif text-xl font-bold text-[#12161A] dark:text-[#F7F5F0]">
              {scholarship.amountFormatted}
            </span>
            <span className="text-[11px] font-mono text-[#2C4E6F] dark:text-[#5C88B5] block mt-0.5">
              {scholarship.coverage}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Eligibility Baseline
            </span>
            <span className="text-sm font-mono font-medium text-[#12161A] dark:text-[#F7F5F0]">
              Min GPA: {scholarship.minGPA}
            </span>
            <span className="text-[11px] font-mono text-[#7E8B99] dark:text-[#7A8796] block mt-0.5">
              {scholarship.financialNeed}
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm text-[#4A5562] dark:text-[#B6C0CC] py-4 line-clamp-3 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Field Badges */}
        <div className="flex flex-wrap gap-1.5 pb-4">
          {scholarship.fields.slice(0, 3).map((field) => (
            <span
              key={field}
              className="px-2 py-0.5 text-[10px] font-mono bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC] rounded"
            >
              {field}
            </span>
          ))}
          {scholarship.fields.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#7E8B99]">
              +{scholarship.fields.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#7E8B99] dark:text-[#7A8796]">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{scholarship.deadlineDaysRemaining} days ({scholarship.deadline})</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedScholarship(scholarship)}
            className="flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-medium border border-[#D1C9BC] dark:border-[#384556] rounded hover:bg-[#F3EFE7] dark:hover:bg-[#1B2129] text-[#12161A] dark:text-[#F7F5F0] transition-colors"
          >
            Inspect
          </button>

          <button
            onClick={() => addApplication(scholarship.id)}
            disabled={isTracking}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors ${
              isTracking
                ? 'bg-[#EBF1F7] dark:bg-[#1A2633] text-[#2C4E6F] dark:text-[#5C88B5] border border-[#2C4E6F]/30 cursor-default'
                : 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] hover:bg-[#2C4E6F]'
            }`}
          >
            {isTracking ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tracked</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Track</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
