export type DegreeLevel = 'Undergraduate' | "Master's" | 'Doctoral / PhD' | 'Postdoctoral' | 'High School Senior';

export type CoverageType = 'Full Tuition & Living' | 'Full Tuition' | 'Partial Tuition' | 'Research Fellowship' | 'Stipend & Travel';

export type FinancialNeedType = 'Need-Based' | 'Merit-Only' | 'Need-Blind' | 'Low-Income Priority';

export interface Scholarship {
  id: string;
  title: string;
  institution: string;
  location: string;
  country: string;
  amount: number;
  amountFormatted: string;
  coverage: CoverageType;
  deadline: string;
  deadlineDaysRemaining: number;
  degreeLevels: DegreeLevel[];
  fields: string[];
  financialNeed: FinancialNeedType;
  minGPA: number;
  description: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  acceptanceRate: string;
  featured?: boolean;
  tags: string[];
  applicationFee: string;
  officialLink: string;
  annualQuota: string;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  currentInstitution: string;
  targetDegree: DegreeLevel;
  gpa: number; // 0.0 to 4.0 scale
  fieldOfStudy: string;
  citizenship: string;
  targetCountry: string;
  householdIncomeBracket: '< $30,000' | '$30,000 - $65,000' | '$65,000 - $120,000' | '> $120,000';
  isFirstGeneration: boolean;
  hasResearchPublications: boolean;
  communityLeadershipHours: number;
}

export type ApplicationStatus = 
  | 'Not Started' 
  | 'Preparing' 
  | 'Submitted' 
  | 'Under Review' 
  | 'Approved' 
  | 'Rejected';

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface ApplicationItem {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  addedDate: string;
  targetDeadline: string;
  notes: string;
  checklist: ChecklistItem[];
  submissionDate?: string;
  lastUpdated: string;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'celebration';
}

export interface FilterState {
  searchQuery: string;
  degree: string;
  field: string;
  country: string;
  coverage: string;
  need: string;
  sortBy: 'deadline' | 'amount-desc' | 'amount-asc' | 'popularity';
  maxIncome?: string;
}

export interface EligibilityResult {
  scholarship: Scholarship;
  matchScore: number; // 0 - 100
  qualifiedItems: string[];
  unqualifiedItems: string[];
  status: 'Highly Recommended' | 'Strong Match' | 'Possible Match' | 'Ineligible';
}

