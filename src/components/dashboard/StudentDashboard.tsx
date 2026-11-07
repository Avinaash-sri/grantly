import React from 'react';
import { useApp } from '../../context/AppContext';
import { PortfolioChart } from './PortfolioChart';
import { 
  User, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Sparkles, 
  FolderKanban
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    studentProfile, 
    applications, 
    scholarships, 
    bookmarks, 
    setCurrentView, 
    setSelectedScholarship, 
    toggleBookmark 
  } = useApp();

  // Metrics calculation
  const trackedScholarships = applications
    .map((app) => ({
      app,
      scholarship: scholarships.find((s) => s.id === app.scholarshipId)
    }))
    .filter((item) => item.scholarship !== undefined) as { app: any; scholarship: any }[];

  const totalTrackedCapital = trackedScholarships.reduce(
    (sum, item) => sum + item.scholarship.amount,
    0
  );

  const approvedGrants = trackedScholarships.filter((item) => item.app.status === 'Approved');
  const totalApprovedCapital = approvedGrants.reduce(
    (sum, item) => sum + item.scholarship.amount,
    0
  );

  // Upcoming deadlines sorted
  const upcomingDeadlines = [...trackedScholarships].sort(
    (a, b) => a.scholarship.deadlineDaysRemaining - b.scholarship.deadlineDaysRemaining
  );

  // Bookmarked scholarships
  const bookmarkedScholarships = scholarships.filter((s) => bookmarks.includes(s.id));

  return (
    <div className="min-h-screen py-10 bg-[#FAF8F5] dark:bg-[#0F1216] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Masthead Greeting Bar */}
        <div className="p-8 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 paper-glow">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5]">
              <User className="w-3.5 h-3.5" />
              <span>SCHOLAR PORTFOLIO • VERIFIED DOSSIER</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              Welcome back, {studentProfile.fullName}.
            </h1>
            <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC]">
              {studentProfile.currentInstitution} • Target: {studentProfile.targetDegree} in {studentProfile.fieldOfStudy} • GPA: {studentProfile.gpa.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('wizard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-white dark:bg-[#1B2129] border border-[#D1C9BC] dark:border-[#384556] rounded text-[#12161A] dark:text-[#F7F5F0] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Update Profile</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('applications');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded hover:bg-[#2C4E6F] transition-colors flex items-center gap-2"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Kanban Tracker</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-2 paper-glow">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Tracked Capital Pool
            </span>
            <div className="font-serif text-3xl font-bold text-[#12161A] dark:text-[#F7F5F0]">
              ${totalTrackedCapital.toLocaleString()}
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Across {applications.length} active applications
            </p>
          </div>

          <div className="p-6 bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-2 paper-glow">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Confirmed Grants Won
            </span>
            <div className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalApprovedCapital.toLocaleString()}
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              {approvedGrants.length} approved award allocations
            </p>
          </div>

          <div className="p-6 bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-2 paper-glow">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Active In-Pipeline
            </span>
            <div className="font-serif text-3xl font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
              {applications.filter((a) => a.status === 'Preparing' || a.status === 'Submitted' || a.status === 'Under Review').length}
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Under review or document preparation
            </p>
          </div>

          <div className="p-6 bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-2 paper-glow">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] block">
              Saved in Dossier
            </span>
            <div className="font-serif text-3xl font-bold text-[#C5A880]">
              {bookmarks.length}
            </div>
            <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
              Pinned grants for future cycles
            </p>
          </div>
        </div>

        {/* Charts & Deadlines Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Portfolio Chart (Span 6) */}
          <div className="lg:col-span-6">
            <PortfolioChart applications={applications} scholarships={scholarships} />
          </div>

          {/* Upcoming Deadlines Radar (Span 6) */}
          <div className="lg:col-span-6 bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] block">
                  ADMISSIONS TIMELINE
                </span>
                <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
                  Upcoming Milestone Deadlines
                </h3>
              </div>
              <span className="text-xs font-mono text-[#7E8B99]">Chronological</span>
            </div>

            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 4).map(({ app, scholarship }) => {
                const isUrgent = scholarship.deadlineDaysRemaining <= 30;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedScholarship(scholarship)}
                    className="p-3.5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded flex items-center justify-between cursor-pointer hover:border-[#2C4E6F] transition-colors"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#12161A] dark:text-[#F7F5F0] truncate">
                          {scholarship.title}
                        </span>
                        <span className={`px-1.5 py-0.2 text-[9px] font-mono uppercase rounded ${
                          app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#7E8B99] dark:text-[#7A8796] block mt-0.5">
                        {scholarship.institution} • {scholarship.amountFormatted}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                        isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-[#7E8B99]'
                      }`}>
                        <Clock className="w-3 h-3" />
                        {scholarship.deadlineDaysRemaining}d
                      </span>
                      <span className="text-[10px] font-mono text-[#7E8B99] block">
                        {scholarship.deadline}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Saved Scholarships Quick Dossier */}
        <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] block">
                PINNED FOR FUTURE SUBMISSION
              </span>
              <h3 className="font-serif text-xl text-[#12161A] dark:text-[#F7F5F0]">
                Saved Grants in Dossier ({bookmarkedScholarships.length})
              </h3>
            </div>
            <button
              onClick={() => {
                setCurrentView('discovery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5] hover:underline flex items-center gap-1"
            >
              <span>Explore More Grants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedScholarships.map((sch) => (
              <div
                key={sch.id}
                className="p-4 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#7E8B99]">
                      {sch.institution}
                    </span>
                    <button
                      onClick={() => toggleBookmark(sch.id)}
                      className="text-[#7E8B99] hover:text-red-500 transition-colors"
                      title="Remove from Saved"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <h4 
                    onClick={() => setSelectedScholarship(sch)}
                    className="font-serif text-base text-[#12161A] dark:text-[#F7F5F0] hover:text-[#2C4E6F] cursor-pointer transition-colors leading-snug mt-1"
                  >
                    {sch.title}
                  </h4>
                  <span className="text-xs font-mono font-bold text-[#2C4E6F] dark:text-[#5C88B5] block mt-1">
                    {sch.amountFormatted}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400">
                    {sch.deadlineDaysRemaining}d remaining
                  </span>
                  <button
                    onClick={() => setSelectedScholarship(sch)}
                    className="text-[#2C4E6F] dark:text-[#5C88B5] hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
