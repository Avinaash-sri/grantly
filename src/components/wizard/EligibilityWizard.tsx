import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, DegreeLevel, EligibilityResult } from '../../types';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Bookmark, 
  Plus, 
  Check
} from 'lucide-react';

export const EligibilityWizard: React.FC = () => {
  const { 
    studentProfile, 
    updateStudentProfile, 
    scholarships, 
    setSelectedScholarship, 
    addApplication, 
    toggleBookmark, 
    isBookmarked,
    applications
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [profileForm, setProfileForm] = useState<StudentProfile>(studentProfile);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [results, setResults] = useState<EligibilityResult[]>([]);

  // Step names
  const steps = [
    { num: 1, title: 'Academic Profile', desc: 'Degree & GPA threshold' },
    { num: 2, title: 'Discipline & Scope', desc: 'Field of specialization' },
    { num: 3, title: 'Geographic Target', desc: 'Citizenship & destination' },
    { num: 4, title: 'Financial & Background', desc: 'Income & equity factors' }
  ];

  // Deterministic rule engine
  const runDeterministicEvaluation = (profile: StudentProfile): EligibilityResult[] => {
    return scholarships.map((sch) => {
      let score = 0;
      const qualified: string[] = [];
      const unqualified: string[] = [];

      // 1. GPA Evaluation (35 points)
      if (profile.gpa >= sch.minGPA) {
        score += 35;
        qualified.push(`GPA ${profile.gpa.toFixed(2)} meets required ${sch.minGPA.toFixed(2)} threshold`);
      } else {
        const diff = (sch.minGPA - profile.gpa).toFixed(2);
        unqualified.push(`GPA is ${diff} below minimum requirement of ${sch.minGPA}`);
      }

      // 2. Degree Level Alignment (25 points)
      if (sch.degreeLevels.includes(profile.targetDegree)) {
        score += 25;
        qualified.push(`Target degree (${profile.targetDegree}) matches eligible cohort`);
      } else {
        unqualified.push(`Endowment restricts funding to: ${sch.degreeLevels.join(', ')}`);
      }

      // 3. Field of Study Alignment (20 points)
      if (sch.fields.includes(profile.fieldOfStudy) || sch.fields.includes('Interdisciplinary')) {
        score += 20;
        qualified.push(`Academic field (${profile.fieldOfStudy}) matches trust mandate`);
      } else {
        unqualified.push(`Trust prioritizes: ${sch.fields.slice(0, 3).join(', ')}`);
      }

      // 4. Geographic & Citizenship Alignment (10 points)
      const targetCountryMatch = 
        sch.country === 'Global' || 
        profile.targetCountry === sch.country ||
        (sch.country === 'United Kingdom' && profile.targetCountry === 'United Kingdom') ||
        (sch.country === 'United States' && profile.targetCountry === 'United States');

      if (targetCountryMatch) {
        score += 10;
        qualified.push(`Destination (${sch.country}) aligns with planned relocation`);
      } else {
        unqualified.push(`Tenure requires residency/study in ${sch.country}`);
      }

      // 5. Need & Background Criteria (10 points)
      if (sch.financialNeed === 'Need-Blind' || sch.financialNeed === 'Merit-Only') {
        score += 10;
        qualified.push(`Financial criteria: open merit (${sch.financialNeed})`);
      } else if (sch.financialNeed === 'Low-Income Priority' || sch.financialNeed === 'Need-Based') {
        if (profile.householdIncomeBracket === '< $30,000' || profile.householdIncomeBracket === '$30,000 - $65,000') {
          score += 10;
          qualified.push('Income bracket qualified for need-based consideration');
        } else {
          score += 5;
          unqualified.push('Priority given to lower household income brackets');
        }
      }

      // First-gen & research publication bonuses
      if (profile.isFirstGeneration && (sch.id === 'soros-new-americans' || sch.id === 'vanderbilt-chancellors-vanguard')) {
        qualified.push('Bonus: First-generation college scholar consideration');
      }

      let status: EligibilityResult['status'] = 'Ineligible';
      if (score >= 85) status = 'Highly Recommended';
      else if (score >= 70) status = 'Strong Match';
      else if (score >= 50) status = 'Possible Match';

      return {
        scholarship: sch,
        matchScore: Math.min(100, score),
        qualifiedItems: qualified,
        unqualifiedItems: unqualified,
        status
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Execute evaluation
      updateStudentProfile(profileForm);
      const evalResults = runDeterministicEvaluation(profileForm);
      setResults(evalResults);
      setHasEvaluated(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[#FAF8F5] dark:bg-[#0F1216] transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Masthead Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EBE5D9] dark:bg-[#242C37] rounded text-xs font-mono uppercase tracking-wider text-[#2C4E6F] dark:text-[#5C88B5]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>DETERMINISTIC EVALUATION ENGINE V2.4</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#12161A] dark:text-[#F7F5F0]">
            Calculate Your Eligibility Index.
          </h1>
          <p className="text-sm text-[#4A5562] dark:text-[#B6C0CC]">
            Evaluate your academic profile against strict endowment constraints. 
            No vague AI approximations — only transparent deterministic criteria matching.
          </p>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm shadow-sm overflow-hidden paper-glow">
          
          {/* Progress Header */}
          <div className="p-6 bg-[#F3EFE7] dark:bg-[#1B2129] border-b border-[#E5E0D4] dark:border-[#2A3340]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((s) => {
                const isCurrent = s.num === currentStep;
                const isPast = s.num < currentStep;
                return (
                  <div key={s.num} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCurrent
                          ? 'bg-[#2C4E6F] text-white'
                          : isPast
                          ? 'bg-[#C5A880] text-white'
                          : 'bg-[#E5E0D4] dark:bg-[#2A3340] text-[#7E8B99]'
                      }`}>
                        {s.num}
                      </span>
                      <span className={`font-semibold ${isCurrent ? 'text-[#12161A] dark:text-[#F7F5F0]' : 'text-[#7E8B99]'}`}>
                        {s.title}
                      </span>
                    </div>
                    <div className="w-full bg-[#E5E0D4] dark:bg-[#2A3340] h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isPast ? 'bg-[#C5A880] w-full' : isCurrent ? 'bg-[#2C4E6F] w-1/2' : 'w-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Step Body */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* STEP 1: Academic Profile */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#E5E0D4] dark:border-[#2A3340] pb-4">
                  <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                    Step 1: Academic Standing & Target Degree
                  </h3>
                  <p className="text-xs text-[#7E8B99] dark:text-[#7A8796] font-mono mt-1">
                    Baseline academic qualifications evaluated against institutional minimums.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                      Target Degree Level
                    </label>
                    <select
                      value={profileForm.targetDegree}
                      onChange={(e) => setProfileForm({ ...profileForm, targetDegree: e.target.value as DegreeLevel })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-sm text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
                    >
                      <option value="Undergraduate">Undergraduate (BSc, BA)</option>
                      <option value="Master's">Master's (MSc, MA, MPhil)</option>
                      <option value="Doctoral / PhD">Doctoral / PhD</option>
                      <option value="Postdoctoral">Postdoctoral Research</option>
                      <option value="High School Senior">High School Senior (Pre-University)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796]">
                        Cumulative GPA (4.0 Scale)
                      </label>
                      <span className="text-sm font-mono font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
                        {profileForm.gpa.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.5"
                      max="4.0"
                      step="0.05"
                      value={profileForm.gpa}
                      onChange={(e) => setProfileForm({ ...profileForm, gpa: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-[#E5E0D4] dark:bg-[#2A3340] rounded-lg appearance-none cursor-pointer accent-[#2C4E6F]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[#7E8B99]">
                      <span>2.50</span>
                      <span>3.00</span>
                      <span>3.50</span>
                      <span>3.80 (High Honors)</span>
                      <span>4.00</span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                      Current / Undergraduate Alma Mater
                    </label>
                    <input
                      type="text"
                      value={profileForm.currentInstitution}
                      onChange={(e) => setProfileForm({ ...profileForm, currentInstitution: e.target.value })}
                      placeholder="e.g., Columbia University, TU Munich, University of Toronto..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-sm text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Discipline & Scope */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#E5E0D4] dark:border-[#2A3340] pb-4">
                  <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                    Step 2: Field of Specialization & Research
                  </h3>
                  <p className="text-xs text-[#7E8B99] dark:text-[#7A8796] font-mono mt-1">
                    Endowments frequently restrict funds to specific subject classifications.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                    Select Primary Field of Study
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Computer Science & AI',
                      'Engineering',
                      'Biomedical Sciences',
                      'Humanities & Law',
                      'Economics & Business',
                      'Environmental & Energy',
                      'Interdisciplinary'
                    ].map((field) => (
                      <div
                        key={field}
                        onClick={() => setProfileForm({ ...profileForm, fieldOfStudy: field })}
                        className={`p-3.5 border rounded cursor-pointer transition-colors flex items-center justify-between ${
                          profileForm.fieldOfStudy === field
                            ? 'bg-[#EBF1F7] dark:bg-[#1A2633] border-[#2C4E6F] text-[#2C4E6F] dark:text-[#5C88B5]'
                            : 'bg-white dark:bg-[#1B2129] border-[#E5E0D4] dark:border-[#2A3340] text-[#12161A] dark:text-[#F7F5F0] hover:bg-[#F3EFE7]'
                        }`}
                      >
                        <span className="text-sm font-medium">{field}</span>
                        {profileForm.fieldOfStudy === field && (
                          <CheckCircle2 className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="researchPubs"
                      checked={profileForm.hasResearchPublications}
                      onChange={(e) => setProfileForm({ ...profileForm, hasResearchPublications: e.target.checked })}
                      className="w-4 h-4 rounded border-[#E5E0D4] text-[#2C4E6F] focus:ring-[#2C4E6F]"
                    />
                    <label htmlFor="researchPubs" className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                      I have authored or co-authored academic research publications or conference preprints.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Geographic Target */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#E5E0D4] dark:border-[#2A3340] pb-4">
                  <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                    Step 3: Citizenship & Target Destination
                  </h3>
                  <p className="text-xs text-[#7E8B99] dark:text-[#7A8796] font-mono mt-1">
                    National charters dictate citizenship eligibility and territorial tenure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                      Citizenship / Nationality
                    </label>
                    <select
                      value={profileForm.citizenship}
                      onChange={(e) => setProfileForm({ ...profileForm, citizenship: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-sm text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany / EU">European Union</option>
                      <option value="India">India</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Nigeria / Commonwealth">Commonwealth Nation</option>
                      <option value="Global Other">Other Nationality</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                      Target Country of Study
                    </label>
                    <select
                      value={profileForm.targetCountry}
                      onChange={(e) => setProfileForm({ ...profileForm, targetCountry: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-sm text-[#12161A] dark:text-[#F7F5F0] focus:outline-none focus:border-[#2C4E6F]"
                    >
                      <option value="United Kingdom">United Kingdom (Oxford, Cambridge, Imperial)</option>
                      <option value="United States">United States (Stanford, Harvard, MIT)</option>
                      <option value="European Union">European Union (ETH Zurich, TU Munich)</option>
                      <option value="Asia-Pacific">Asia-Pacific (Tokyo, Tsinghua, NUS)</option>
                      <option value="Global">Open to Worldwide Opportunities</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Financial & Background */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#E5E0D4] dark:border-[#2A3340] pb-4">
                  <h3 className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0]">
                    Step 4: Financial Need & Equity Factors
                  </h3>
                  <p className="text-xs text-[#7E8B99] dark:text-[#7A8796] font-mono mt-1">
                    Need-based endowments and diversity initiatives evaluate household income and first-generation status.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-mono uppercase text-[#7E8B99] dark:text-[#7A8796] block">
                    Annual Household Income Bracket
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      '< $30,000',
                      '$30,000 - $65,000',
                      '$65,000 - $120,000',
                      '> $120,000'
                    ].map((bracket) => (
                      <div
                        key={bracket}
                        onClick={() => setProfileForm({ ...profileForm, householdIncomeBracket: bracket as any })}
                        className={`p-3.5 border rounded cursor-pointer transition-colors flex items-center justify-between ${
                          profileForm.householdIncomeBracket === bracket
                            ? 'bg-[#EBF1F7] dark:bg-[#1A2633] border-[#2C4E6F] text-[#2C4E6F] dark:text-[#5C88B5]'
                            : 'bg-white dark:bg-[#1B2129] border-[#E5E0D4] dark:border-[#2A3340] text-[#12161A] dark:text-[#F7F5F0] hover:bg-[#F3EFE7]'
                        }`}
                      >
                        <span className="text-sm font-medium">{bracket}</span>
                        {profileForm.householdIncomeBracket === bracket && (
                          <CheckCircle2 className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="firstGen"
                        checked={profileForm.isFirstGeneration}
                        onChange={(e) => setProfileForm({ ...profileForm, isFirstGeneration: e.target.checked })}
                        className="w-4 h-4 rounded border-[#E5E0D4] text-[#2C4E6F] focus:ring-[#2C4E6F]"
                      />
                      <label htmlFor="firstGen" className="text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                        I am a First-Generation College Scholar (neither parent completed a 4-year bachelor's degree).
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Form Actions Footer */}
          <div className="p-6 bg-[#F3EFE7] dark:bg-[#1B2129] border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-[#D1C9BC] dark:border-[#384556] rounded text-xs font-mono uppercase tracking-wider text-[#12161A] dark:text-[#F7F5F0] hover:bg-white dark:hover:bg-[#161B22] transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] rounded text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#2C4E6F] dark:hover:bg-[#EBE5D9] transition-colors flex items-center gap-2 shadow-sm"
            >
              <span>{currentStep === 4 ? 'Compute Eligibility Matrix' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RESULTS SECTION: Shown once evaluated */}
        {hasEvaluated && (
          <div className="space-y-8 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E5E0D4] dark:border-[#2A3340] pb-4 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C5A880] block">
                  SYNTHESIZED MATRIX REPORT
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#12161A] dark:text-[#F7F5F0]">
                  Evaluated Endowments for {profileForm.fullName || 'Scholar'}.
                </h2>
              </div>
              <button
                onClick={() => {
                  setHasEvaluated(false);
                  setCurrentStep(1);
                }}
                className="text-xs font-mono text-[#7E8B99] hover:text-[#12161A] dark:hover:text-[#F7F5F0] flex items-center gap-1 self-start sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Recalibrate Inputs</span>
              </button>
            </div>

            {/* Results Cards List */}
            <div className="space-y-6">
              {results.map(({ scholarship, matchScore, qualifiedItems, unqualifiedItems, status }) => {
                const bookmarked = isBookmarked(scholarship.id);
                const isTracking = applications.some((a) => a.scholarshipId === scholarship.id);

                let badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200';
                if (status === 'Highly Recommended') {
                  badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200';
                } else if (status === 'Strong Match') {
                  badgeColor = 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200';
                }

                return (
                  <div
                    key={scholarship.id}
                    className="bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-sm p-6 sm:p-8 space-y-6 paper-glow hover:border-[#C5A880]/80 transition-all"
                  >
                    {/* Top Result Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D4] dark:border-[#2A3340]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border ${badgeColor}`}>
                            {status}
                          </span>
                          <span className="text-xs font-mono text-[#7E8B99]">
                            {scholarship.institution}
                          </span>
                        </div>
                        <h3 
                          onClick={() => setSelectedScholarship(scholarship)}
                          className="font-serif text-2xl text-[#12161A] dark:text-[#F7F5F0] hover:text-[#2C4E6F] cursor-pointer transition-colors"
                        >
                          {scholarship.title}
                        </h3>
                      </div>

                      {/* Match Score Display */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E8B99] block">
                            Match Index
                          </span>
                          <span className="font-serif text-3xl font-bold text-[#2C4E6F] dark:text-[#5C88B5]">
                            {matchScore}%
                          </span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(scholarship.id)}
                          className={`p-2 rounded border transition-colors ${
                            bookmarked
                              ? 'bg-[#2C4E6F] text-white border-[#2C4E6F]'
                              : 'bg-white dark:bg-[#1B2129] text-[#7E8B99] border-[#E5E0D4] dark:border-[#2A3340]'
                          }`}
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Breakdown Columns: Qualified vs Unqualified */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Qualified Criteria */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold block">
                          Verified Qualified Prerequisites ({qualifiedItems.length})
                        </span>
                        <div className="space-y-1.5">
                          {qualifiedItems.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Missing / Strict Requirements */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold block">
                          Criteria Discrepancies or Notes ({unqualifiedItems.length})
                        </span>
                        {unqualifiedItems.length === 0 ? (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">
                            All core prerequisites completely satisfied.
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            {unqualifiedItems.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-[#4A5562] dark:text-[#B6C0CC]">
                                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-[#E5E0D4] dark:border-[#2A3340] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
                      <div className="text-[#7E8B99]">
                        Total Award: <span className="font-semibold text-[#12161A] dark:text-[#F7F5F0]">{scholarship.amountFormatted}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedScholarship(scholarship)}
                          className="px-3.5 py-1.5 border border-[#D1C9BC] dark:border-[#384556] rounded hover:bg-white dark:hover:bg-[#1B2129] transition-colors"
                        >
                          Inspect Full Dossier
                        </button>
                        <button
                          onClick={() => addApplication(scholarship.id)}
                          disabled={isTracking}
                          className={`px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
                            isTracking
                              ? 'bg-[#EBF1F7] dark:bg-[#1A2633] text-[#2C4E6F] dark:text-[#5C88B5]'
                              : 'bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] hover:bg-[#2C4E6F]'
                          }`}
                        >
                          {isTracking ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isTracking ? 'Tracked in Portfolio' : 'Track Application'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
