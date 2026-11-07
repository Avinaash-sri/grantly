import { ApplicationItem, StudentProfile } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  fullName: 'Julian Vance Montgomery',
  email: 'j.montgomery@alumni.columbia.edu',
  currentInstitution: 'Columbia University & Institut Français',
  targetDegree: "Master's",
  gpa: 3.82,
  fieldOfStudy: 'Computer Science & AI',
  citizenship: 'United States',
  targetCountry: 'United Kingdom',
  householdIncomeBracket: '$30,000 - $65,000',
  isFirstGeneration: true,
  hasResearchPublications: true,
  communityLeadershipHours: 240
};

export const INITIAL_APPLICATIONS: ApplicationItem[] = [
  {
    id: 'app-rhodes-1',
    scholarshipId: 'rhodes-trust-oxford',
    status: 'Preparing',
    addedDate: '2026-08-14',
    targetDeadline: '2026-10-01',
    notes: 'Draft 3 of Personal Statement complete. Awaiting final letter from Prof. Hawthorne regarding algorithmic ethics.',
    checklist: [
      { id: 'c1', label: 'WES Credential Evaluation', completed: true },
      { id: 'c2', label: 'Academic CV (2-page format)', completed: true },
      { id: 'c3', label: 'Statement of Purpose (1,000 words)', completed: true },
      { id: 'c4', label: 'Four Letters of Recommendation', completed: false },
      { id: 'c5', label: 'Institutional Endorsement Packet', completed: false }
    ],
    lastUpdated: '2026-09-02'
  },
  {
    id: 'app-knight-2',
    scholarshipId: 'knight-hennessy-stanford',
    status: 'Under Review',
    addedDate: '2026-07-20',
    targetDeadline: '2026-10-15',
    notes: 'Submitted on Sept 1st. Interview invitation notification expected early November.',
    checklist: [
      { id: 'k1', label: 'Stanford Graduate Application submitted', completed: true },
      { id: 'k2', label: 'KHS Leadership short answers finalized', completed: true },
      { id: 'k3', label: 'Video introduction link verified', completed: true },
      { id: 'k4', label: 'Two leadership recommendation references', completed: true },
      { id: 'k5', label: 'Official Transcripts submitted', completed: true }
    ],
    submissionDate: '2026-09-01',
    lastUpdated: '2026-09-04'
  },
  {
    id: 'app-turing-3',
    scholarshipId: 'turing-vanguard-computing',
    status: 'Approved',
    addedDate: '2026-06-11',
    targetDeadline: '2026-11-20',
    notes: 'Grant approved! $52,000 allocation confirmed with initial compute clusters provisioned.',
    checklist: [
      { id: 't1', label: 'Research Statement submission', completed: true },
      { id: 't2', label: 'GitHub open-source repository audited', completed: true },
      { id: 't3', label: 'Faculty letters transmitted', completed: true },
      { id: 't4', label: 'Grant acceptance letter signed', completed: true }
    ],
    submissionDate: '2026-07-15',
    lastUpdated: '2026-08-30'
  },
  {
    id: 'app-eth-4',
    scholarshipId: 'eth-zurich-excellence',
    status: 'Submitted',
    addedDate: '2026-08-01',
    targetDeadline: '2026-12-15',
    notes: 'ESOP pre-proposal on robust neural representations submitted through the ETH Zurich portal.',
    checklist: [
      { id: 'e1', label: 'ESOP Thesis Proposal drafting', completed: true },
      { id: 'e2', label: 'Two Academic References', completed: true },
      { id: 'e3', label: 'Class ranking certificate', completed: true },
      { id: 'e4', label: 'Certified degree transcripts', completed: true }
    ],
    submissionDate: '2026-09-05',
    lastUpdated: '2026-09-05'
  },
  {
    id: 'app-soros-5',
    scholarshipId: 'soros-new-americans',
    status: 'Not Started',
    addedDate: '2026-09-01',
    targetDeadline: '2026-10-28',
    notes: 'Gathering immigrant lineage documentation and brainstorming first essay prompt.',
    checklist: [
      { id: 's1', label: 'Eligibility status documentation', completed: false },
      { id: 's2', label: 'Essay 1: New American experience', completed: false },
      { id: 's3', label: 'Essay 2: Professional trajectory', completed: false },
      { id: 's4', label: 'Three letters of recommendation', completed: false }
    ],
    lastUpdated: '2026-09-01'
  }
];

export const INITIAL_BOOKMARKS: string[] = [
  'rhodes-trust-oxford',
  'knight-hennessy-stanford',
  'turing-vanguard-computing',
  'eth-zurich-excellence'
];

export interface TestimonialStory {
  quote: string;
  author: string;
  grantReceived: string;
  amount: string;
  institution: string;
  role: string;
  year: string;
}

export const SCHOLAR_TESTIMONIALS: TestimonialStory[] = [
  {
    quote: 'GRANTLY fundamentally shifted how I approached institutional funding. Instead of scouring outdated forums, I had a deterministic map of requirements and a portfolio manager that kept my four Oxford applications synchronized.',
    author: 'Elena Rostova',
    grantReceived: 'The Rhodes Trust Global Fellowship',
    amount: '£75,000 / yr',
    institution: 'University of Oxford',
    role: 'Doctoral Candidate in Computational Genomics',
    year: 'Class of 2025'
  },
  {
    quote: 'As a first-generation student, the landscape of private endowments felt opaque and inaccessible. The eligibility wizard surfaced grants I never would have discovered, including the Soros Fellowship that funded my Stanford degree.',
    author: 'Tariq Al-Mansoor',
    grantReceived: 'The Paul & Daisy Soros Fellowship',
    amount: '$90,000 Endowment',
    institution: 'Stanford School of Engineering',
    role: 'MS in AI Ethics & Robotics',
    year: 'Class of 2024'
  },
  {
    quote: 'The application Kanban tracker transformed our laboratory team’s graduate grant submissions. Tracking milestone checklists and deadline countdowns made applying to ETH Zurich feel methodical and structured.',
    author: 'Dr. Chantal Mercier',
    grantReceived: 'ETH Zurich ESOP Award',
    amount: 'CHF 48,000',
    institution: 'ETH Zurich',
    role: 'Postdoctoral Fellow in Renewable Materials',
    year: 'Class of 2025'
  }
];

