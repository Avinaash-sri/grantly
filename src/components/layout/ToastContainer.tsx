import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-[#E5E0D4] dark:border-[#2A3340]';
        let iconColor = 'text-[#2C4E6F] dark:text-[#5C88B5]';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-[#2C4E6F]/40';
          iconColor = 'text-[#2C4E6F] dark:text-[#5C88B5]';
        } else if (toast.type === 'celebration') {
          Icon = Sparkles;
          borderColor = 'border-[#C5A880]/60';
          iconColor = 'text-[#C5A880]';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          borderColor = 'border-amber-400/40';
          iconColor = 'text-amber-600 dark:text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#FAF8F5] dark:bg-[#1B2129] border ${borderColor} rounded-md shadow-lg p-3.5 flex items-start gap-3 transition-all duration-200 paper-glow`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#12161A] dark:text-[#F7F5F0]">
                {toast.title}
              </h5>
              <p className="text-xs text-[#4A5562] dark:text-[#B6C0CC] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

