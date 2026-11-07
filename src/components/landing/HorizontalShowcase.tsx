import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HorizontalShowcase: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Deterministic Eligibility Synthesizer',
      subtitle: 'Algorithmic Matching Engine',
      description: 'Input your academic transcript, target degrees, and citizenship profile. The engine cross-evaluates your profile against exact endowment constraints without guesswork.',
      stats: '14 Endowment Rule Matrices',
      buttonLabel: 'Test Your Eligibility',
      actionView: 'wizard' as const,
      preview: {
        badge: 'PROFILE EVALUATED',
        highlight: '94.8% Compatibility with Rhodes & Knight-Hennessy',
        items: [
          'GPA 3.82 meets 3.70 minimum threshold (Passed)',
          'Postgraduate Master’s enrollment path (Aligned)',
          'Global citizenship eligibility confirmed (Verified)'
        ]
      }
    },
    {
      num: '02',
      title: 'Curated Trust Dossiers',
      subtitle: 'The Discovery Repository',
      description: 'Review institutional trusts with complete clarity on annual quotas, acceptance historical rates, funding amounts, and exact documentation checklists.',
      stats: '$42,600,000 Total Capital',
      buttonLabel: 'Explore Trust Catalog',
      actionView: 'discovery' as const,
      preview: {
        badge: 'PORTFOLIO METRICS',
        highlight: 'Full Tuition + £19,000 Annual Living Stipend',
        items: [
          'Direct University of Oxford collegiate allocation',
          'Zero application processing surcharge',
          '102 annual global cohort positions'
        ]
      }
    },
    {
      num: '03',
      title: 'Milestone Application Tracker',
      subtitle: 'Kanban & Portfolio Manager',
      description: 'Keep your graduate applications synchronized. Manage drafts of your Statement of Purpose, verify recommendation letter submissions, and monitor deadline countdowns.',
      stats: '6 Execution Stages',
      buttonLabel: 'Open Application Tracker',
      actionView: 'applications' as const,
      preview: {
        badge: 'DOSSIER STATUS',
        highlight: 'Knight-Hennessy: 5 of 5 Checklist Milestones Complete',
        items: [
          'Transcripts official transcript packet (Verified)',
          'Leadership statement draft 3 (Completed)',
          'Two faculty reference letters transmitted (Received)'
        ]
      }
    },
    {
      num: '04',
      title: 'Disbursement & Award Monitoring',
      subtitle: 'Endowment Execution',
      description: 'Once granted, record stipend schedules, compute hardware allocations, and travel grants in your unified executive dashboard.',
      stats: '100% Student Retained',
      buttonLabel: 'View Scholar Dashboard',
      actionView: 'dashboard' as const,
      preview: {
        badge: 'AWARD CONFIRMED',
        highlight: 'Turing Vanguard AI Grant — $52,000 Disbursed',
        items: [
          'Academic compute cluster access provisioned',
          'Travel budget allocated for NeurIPS symposium',
          'Quarterly research milestone cadence scheduled'
        ]
      }
    }
  ];

  const current = steps[activeStep];

  return (
    <section className="py-24 border-b border-[#E5E0D4] dark:border-[#2A3340] bg-[#F3EFE7] dark:bg-[#12161A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase text-[#C5A880] block mb-2">
              METHODOLOGY & WORKFLOW
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#12161A] dark:text-[#F7F5F0]">
              The Lifecycle of an Endowment Application.
            </h2>
          </div>
          <p className="text-sm text-[#7E8B99] dark:text-[#7A8796] mt-4 md:mt-0 font-mono">
            STAGES 01 THROUGH 04
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`p-4 text-left rounded-sm border transition-all ${
                  isActive
                    ? 'bg-[#FAF8F5] dark:bg-[#1B2129] border-[#2C4E6F] dark:border-[#5C88B5] shadow-sm'
                    : 'bg-[#FAF8F5]/60 dark:bg-[#161B22]/60 border-[#E5E0D4] dark:border-[#2A3340] hover:bg-[#FAF8F5] dark:hover:bg-[#1B2129]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className={isActive ? 'text-[#2C4E6F] dark:text-[#5C88B5] font-bold' : 'text-[#7E8B99]'}>
                    {step.num}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2C4E6F] dark:bg-[#5C88B5]"></span>}
                </div>
                <div className="text-sm font-medium text-[#12161A] dark:text-[#F7F5F0] truncate">
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] p-8 sm:p-12 rounded-sm shadow-sm">
          
          {/* Left: Stage Information */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono text-[#2C4E6F] dark:text-[#5C88B5]">
              <Layers className="w-3.5 h-3.5" />
              <span>STAGE {current.num} • {current.subtitle.toUpperCase()}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-[#12161A] dark:text-[#F7F5F0]">
              {current.title}
            </h3>

            <p className="text-base text-[#4A5562] dark:text-[#B6C0CC] leading-relaxed">
              {current.description}
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-[#7E8B99] dark:text-[#7A8796]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]"></span>
                <span>{current.stats}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentView(current.actionView);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] font-medium text-xs rounded hover:bg-[#2C4E6F] dark:hover:bg-[#EBE5D9] transition-colors inline-flex items-center gap-2"
              >
                <span>{current.buttonLabel}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Interactive UI Dossier Card Preview */}
          <div className="lg:col-span-6">
            <div className="p-6 bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#C5A880] font-semibold">
                  {current.preview.badge}
                </span>
                <span className="text-xs font-mono text-[#7E8B99] dark:text-[#7A8796]">
                  SIMULATED DISPATCH
                </span>
              </div>

              <div className="font-serif text-lg text-[#12161A] dark:text-[#F7F5F0] font-medium">
                {current.preview.highlight}
              </div>

              <div className="space-y-2.5 pt-2">
                {current.preview.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                    <CheckCircle2 className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between text-[11px] font-mono text-[#7E8B99]">
                <span>ENCRYPTED CLIENT PERSISTENCE</span>
                <span>STATUS: VERIFIED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
