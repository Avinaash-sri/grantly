import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationItem, ApplicationStatus, Scholarship } from '../../types';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { 
  FolderKanban, 
  ListOrdered, 
  Plus, 
  Clock, 
  Search
} from 'lucide-react';

export const ApplicationTracker: React.FC = () => {
  const { applications, scholarships, addApplication } = useApp();

  const [activeView, setActiveView] = useState<'kanban' | 'timeline'>('kanban');
  const [selectedApp, setSelectedApp] = useState<{ app: ApplicationItem; scholarship: Scholarship } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const statuses: ApplicationStatus[] = [
    'Not Started',
    'Preparing',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected'
  ];

  // Match applications to scholarships
  const populatedApps = applications
    .map((app) => ({
      app,
      scholarship: scholarships.find((s) => s.id === app.scholarshipId)
    }))
    .filter((item) => item.scholarship !== undefined) as { app: ApplicationItem; scholarship: Scholarship }[];

  const filteredApps = populatedApps.filter(({ scholarship }) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return scholarship.title.toLowerCase().includes(q) || scholarship.institution.toLowerCase().includes(q);
  });

  // Untracked scholarships available to add
  const untrackedScholarships = scholarships.filter(
    (s) => !applications.some((a) => a.scholarshipId === s.id)
  );

  return (
    <div className="min-h-screen py-10 bg-[#FAF8F5] dark:bg-[#0F1216] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Masthead Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5] mb-2">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>APPLICATION DOSSIER MANAGEMENT</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              Application Portfolio Tracker.
            </h1>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC] mt-1">
              Synchronizing {applications.length} active endowment dossiers across 6 institutional review phases.
            </p>
          </div>

          {/* Controls: Search, View Switcher & Add Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="flex bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveView('kanban')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeView === 'kanban'
                    ? 'bg-white dark:bg-[#242C37] text-[#12161A] dark:text-[#F7F5F0] shadow-xs'
                    : 'text-[#7E8B99] hover:text-[#12161A]'
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setActiveView('timeline')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                  activeView === 'timeline'
                    ? 'bg-white dark:bg-[#242C37] text-[#12161A] dark:text-[#F7F5F0] shadow-xs'
                    : 'text-[#7E8B99] hover:text-[#12161A]'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>

            {/* Add New Application Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#2C4E6F] transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Track New Grant</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#7E8B99] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within tracked applications..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
          />
        </div>

        {/* KANBAN VIEW */}
        {activeView === 'kanban' && (
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4 min-w-max">
              {statuses.map((status) => {
                const columnApps = filteredApps.filter(({ app }) => app.status === status);
                return (
                  <KanbanColumn
                    key={status}
                    status={status}
                    applications={columnApps}
                    onSelectApp={(app, scholarship) => setSelectedApp({ app, scholarship })}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* TIMELINE VIEW */}
        {activeView === 'timeline' && (
          <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-8 space-y-6 paper-glow">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
              <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                Milestone & Submission Timeline
              </h3>
              <span className="text-xs font-mono text-[#7E8B99]">Chronological Deadlines</span>
            </div>

            <div className="space-y-4">
              {filteredApps
                .sort((a, b) => a.scholarship.deadlineDaysRemaining - b.scholarship.deadlineDaysRemaining)
                .map(({ app, scholarship }) => {
                  const completed = app.checklist.filter((c) => c.completed).length;
                  const total = app.checklist.length || 1;
                  const percent = Math.round((completed / total) * 100);

                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp({ app, scholarship })}
                      className="p-5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-[#2C4E6F] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-[#EBE5D9] dark:bg-[#242C37] rounded font-semibold text-[#2C4E6F] dark:text-[#5C88B5]">
                            {app.status}
                          </span>
                          <span className="text-xs font-mono text-[#7E8B99]">
                            {scholarship.institution}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg text-[#12161A] dark:text-[#F7F5F0]">
                          {scholarship.title}
                        </h4>
                        <div className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                          {completed} of {total} documents submitted ({percent}%)
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif text-lg font-bold text-[#2C4E6F] dark:text-[#5C88B5] block">
                          {scholarship.amountFormatted}
                        </span>
                        <span className="text-xs font-mono text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          Deadline: {scholarship.deadline} ({scholarship.deadlineDaysRemaining}d)
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Add Application Modal Dialog */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
                  Track a New Endowment
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-[#7E8B99] hover:text-[#12161A]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {untrackedScholarships.length === 0 ? (
                  <p className="text-sm text-[#7E8B99] text-center py-6">
                    All available scholarships are currently tracked in your portfolio.
                  </p>
                ) : (
                  untrackedScholarships.map((sch) => (
                    <div
                      key={sch.id}
                      onClick={() => {
                        addApplication(sch.id);
                        setShowAddModal(false);
                      }}
                      className="p-3 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded cursor-pointer hover:border-[#2C4E6F] transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#7E8B99] block">
                          {sch.institution}
                        </span>
                        <h5 className="font-serif text-sm text-[#12161A] dark:text-[#F7F5F0]">
                          {sch.title}
                        </h5>
                        <span className="text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
                          {sch.amountFormatted}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-[#E5E0D4] dark:border-[#2A3340] flex justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#D1C9BC] dark:border-[#384556] rounded text-xs font-mono uppercase"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Application Inspector Modal */}
        {selectedApp && (
          <ApplicationDetailModal
            app={selectedApp.app}
            scholarship={selectedApp.scholarship}
            onClose={() => setSelectedApp(null)}
          />
        )}

      </div>
    </div>
  );
};
