import React, { useState } from 'react';
import { ApplicationItem, ApplicationStatus, Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationDetailModalProps {
  app: ApplicationItem;
  scholarship: Scholarship;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  app,
  scholarship,
  onClose
}) => {
  const { 
    updateApplicationStatus, 
    updateApplicationNotes, 
    toggleChecklistItem, 
    deleteApplication, 
    addToast 
  } = useApp();

  const [notes, setNotes] = useState(app.notes);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [checklist, setChecklist] = useState(app.checklist);

  const statuses: ApplicationStatus[] = [
    'Not Started',
    'Preparing',
    'Submitted',
    'Under Review',
    'Approved',
    'Rejected'
  ];

  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPercent = Math.round((completedCount / (checklist.length || 1)) * 100);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    updateApplicationStatus(app.id, newStatus);
    if (newStatus === 'Approved') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSaveNotes = () => {
    updateApplicationNotes(app.id, notes);
    addToast('Notes Saved', 'Application notes synchronized.', 'success');
  };

  const handleToggleCheck = (chkId: string) => {
    toggleChecklistItem(app.id, chkId);
    setChecklist((prev) =>
      prev.map((c) => (c.id === chkId ? { ...c, completed: !c.completed } : c))
    );
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem = {
      id: `custom-${Date.now()}`,
      label: newChecklistText.trim(),
      completed: false
    };
    const updated = [...checklist, newItem];
    setChecklist(updated);
    setNewChecklistText('');
    addToast('Checklist Updated', 'New milestone task added.', 'info');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove the application for ${scholarship.title}?`)) {
      deleteApplication(app.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[92vh] bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#1B2129] relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] rounded"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="pr-12 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] block font-semibold">
              {scholarship.institution} • APPLICATION DOSSIER
            </span>
            <h2 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
              {scholarship.title}
            </h2>
            <div className="flex items-center gap-3 text-xs font-mono text-[#7E8B99]">
              <span className="text-[#2C4E6F] dark:text-[#5C88B5] font-semibold">
                {scholarship.amountFormatted}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                Target: {app.targetDeadline}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Status & Progress Bar */}
          <div className="p-4 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7E8B99]">
                Application Stage
              </span>
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
                className="px-3 py-1.5 bg-[#F3EFE7] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-xs font-mono font-semibold text-[#12161A] dark:text-[#F7F5F0] focus:outline-none"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist Progress Indicator */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#7E8B99]">Checklist Readiness:</span>
                <span className="font-semibold text-[#12161A] dark:text-[#F7F5F0]">
                  {completedCount} of {checklist.length} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#E5E0D4] dark:bg-[#2A3340] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2C4E6F] dark:bg-[#5C88B5] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Document Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] font-semibold">
              Milestone Documents & Credentials
            </h4>
            
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`p-3 border rounded flex items-center justify-between cursor-pointer transition-colors ${
                    item.completed
                      ? 'bg-[#EBF1F7]/50 dark:bg-[#1A2633]/50 border-[#2C4E6F]/30 text-[#12161A] dark:text-[#F7F5F0]'
                      : 'bg-white dark:bg-[#1B2129] border-[#E5E0D4] dark:border-[#2A3340] text-[#4A5562] dark:text-[#B6C0CC]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#7E8B99] shrink-0" />
                    )}
                    <span className={`text-xs ${item.completed ? 'line-through text-[#7E8B99]' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#7E8B99] uppercase shrink-0">
                    {item.completed ? 'Verified' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Custom Task Form */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                placeholder="Add custom task (e.g., Draft email to Dean, Order official transcript)..."
                className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#2C4E6F] text-white text-xs font-mono uppercase rounded flex items-center gap-1 hover:bg-[#233E59] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Research & Essay Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#7E8B99] dark:text-[#7A8796] font-semibold">
                Application Notes & Statement Draft Ideas
              </h4>
              <button
                onClick={handleSaveNotes}
                className="text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5] hover:underline"
              >
                Save Notes
              </button>
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record essay hooks, faculty advisors to mention, interview questions..."
              className="w-full p-3 text-xs bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F3EFE7] dark:bg-[#1B2129] border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3 py-2 text-xs font-mono uppercase text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Application</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#2C4E6F] transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
