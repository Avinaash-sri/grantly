import React from 'react';
import { ApplicationItem, ApplicationStatus, Scholarship } from '../../types';
import { ApplicationCard } from './ApplicationCard';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: { app: ApplicationItem; scholarship: Scholarship }[];
  onSelectApp: (app: ApplicationItem, scholarship: Scholarship) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  applications,
  onSelectApp
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-400';
      case 'Preparing':
        return 'bg-[#2C4E6F]';
      case 'Submitted':
        return 'bg-[#5C88B5]';
      case 'Under Review':
        return 'bg-[#C5A880]';
      case 'Approved':
        return 'bg-emerald-500';
      case 'Rejected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm flex flex-col min-w-[270px] max-w-[320px] w-full shrink-0 paper-glow">
      {/* Column Header */}
      <div className="p-4 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#1B2129] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[#12161A] dark:text-[#F7F5F0]">
            {status}
          </h3>
        </div>
        <span className="w-5 h-5 rounded-full bg-white dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] text-[10px] font-mono font-bold flex items-center justify-center text-[#4A5562] dark:text-[#B6C0CC]">
          {applications.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="p-3 space-y-3 overflow-y-auto max-h-[640px] flex-1">
        {applications.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#7E8B99] dark:text-[#7A8796] border border-dashed border-[#E5E0D4] dark:border-[#2A3340] rounded">
            No applications in {status.toLowerCase()}
          </div>
        ) : (
          applications.map(({ app, scholarship }) => (
            <ApplicationCard
              key={app.id}
              app={app}
              scholarship={scholarship}
              onClick={() => onSelectApp(app, scholarship)}
            />
          ))
        )}
      </div>
    </div>
  );
};

