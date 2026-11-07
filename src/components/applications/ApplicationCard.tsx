import React from 'react';
import { ApplicationItem, ApplicationStatus, Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock } from 'lucide-react';

interface ApplicationCardProps {
  app: ApplicationItem;
  scholarship: Scholarship;
  onClick: () => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  scholarship,
  onClick
}) => {
  const { updateApplicationStatus } = useApp();

  const completedCount = app.checklist.filter((c) => c.completed).length;
  const totalCount = app.checklist.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const statuses: ApplicationStatus[] = [
    'Not Started',
    'Preparing',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected'
  ];

  const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    updateApplicationStatus(app.id, e.target.value as ApplicationStatus);
  };

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-sm hover:border-[#C5A880]/80 transition-all cursor-pointer space-y-3 paper-glow group"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block truncate">
            {scholarship.institution}
          </span>
          <h4 className="font-serif text-base font-medium text-[#12161A] dark:text-[#F7F5F0] leading-snug group-hover:text-[#2C4E6F] dark:group-hover:text-[#5C88B5] transition-colors line-clamp-2">
            {scholarship.title}
          </h4>
        </div>
      </div>

      {/* Funding & Urgency */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-serif font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
          {scholarship.amountFormatted}
        </span>
        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          {scholarship.deadlineDaysRemaining}d
        </span>
      </div>

      {/* Checklist Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-[#7E8B99]">
          <span>Materials:</span>
          <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
        </div>
        <div className="w-full bg-[#E5E0D4] dark:bg-[#2A3340] h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2C4E6F] dark:bg-[#5C88B5] h-full rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Move Status Selector */}
      <div className="pt-2 border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#7E8B99] uppercase">Stage:</span>
        <select
          value={app.status}
          onChange={handleStatusSelect}
          onClick={(e) => e.stopPropagation()}
          className="px-2 py-0.5 text-[10px] font-mono bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none"
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
