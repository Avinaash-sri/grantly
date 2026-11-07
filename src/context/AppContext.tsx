import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Scholarship, 
  StudentProfile, 
  ApplicationItem, 
  ApplicationStatus, 
  ToastNotification, 
  FilterState 
} from '../types';
import { SCHOLARSHIPS_DATA } from '../data/scholarships';
import { INITIAL_STUDENT_PROFILE, INITIAL_APPLICATIONS, INITIAL_BOOKMARKS } from '../data/mockProfile';

export type ActiveView = 'landing' | 'discovery' | 'wizard' | 'dashboard' | 'applications';

interface AppContextType {
  currentView: ActiveView;
  setCurrentView: (view: ActiveView) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  bookmarks: string[];
  toggleBookmark: (scholarshipId: string) => void;
  isBookmarked: (scholarshipId: string) => boolean;
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  applications: ApplicationItem[];
  addApplication: (scholarshipId: string) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  updateApplicationNotes: (appId: string, notes: string) => void;
  toggleChecklistItem: (appId: string, checklistId: string) => void;
  deleteApplication: (appId: string) => void;
  selectedScholarship: Scholarship | null;
  setSelectedScholarship: (scholarship: Scholarship | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  scholarships: Scholarship[];
  comparisonList: string[];
  toggleComparison: (scholarshipId: string) => void;
  clearComparison: () => void;
  isCompared: (scholarshipId: string) => boolean;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  degree: 'All Degrees',
  field: 'All Fields',
  country: 'All Locations',
  coverage: 'All Coverages',
  need: 'All Financial Types',
  sortBy: 'deadline'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toastCounterRef = React.useRef(0);
  const [currentView, setCurrentView] = useState<ActiveView>('landing');
  const [scholarships] = useState<Scholarship[]>(SCHOLARSHIPS_DATA);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [filterState, setFilterState] = useState<FilterState>(initialFilters);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('grantly_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('grantly_bookmarks');
      return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
    } catch {
      return INITIAL_BOOKMARKS;
    }
  });

  // Student Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('grantly_profile');
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  // Applications state
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem('grantly_applications');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Sync theme with DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('grantly_theme', theme);
  }, [theme]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('grantly_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync studentProfile to localStorage
  useEffect(() => {
    localStorage.setItem('grantly_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  // Sync applications to localStorage
  useEffect(() => {
    localStorage.setItem('grantly_applications', JSON.stringify(applications));
  }, [applications]);

  // Global key listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setSelectedScholarship(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(
      'Theme Updated',
      `Switched to ${theme === 'light' ? 'Midnight Ink' : 'Warm Ivory'} mode`,
      'info'
    );
  };

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    toastCounterRef.current += 1;
    const id = `toast-${toastCounterRef.current}`;
    const newToast: ToastNotification = { id, title, message, type };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleBookmark = (scholarshipId: string) => {
    const exists = bookmarks.includes(scholarshipId);
    const target = scholarships.find((s) => s.id === scholarshipId);
    const name = target ? target.title : 'Scholarship';

    if (exists) {
      setBookmarks((prev) => prev.filter((id) => id !== scholarshipId));
      addToast('Removed from Dossier', `${name} removed from your saved grants.`, 'info');
    } else {
      setBookmarks((prev) => [...prev, scholarshipId]);
      addToast('Saved to Dossier', `${name} pinned for tracking.`, 'success');
    }
  };

  const isBookmarked = (scholarshipId: string) => bookmarks.includes(scholarshipId);

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updated }));
    addToast('Profile Synchronized', 'Deterministic eligibility index recalculated.', 'success');
  };

  const addApplication = (scholarshipId: string) => {
    const existing = applications.find((a) => a.scholarshipId === scholarshipId);
    const scholarship = scholarships.find((s) => s.id === scholarshipId);
    if (!scholarship) return;

    if (existing) {
      addToast('Already in Portfolio', `${scholarship.title} is already being tracked.`, 'warning');
      return;
    }

    const newApp: ApplicationItem = {
      id: `app-${scholarshipId}`,
      scholarshipId,
      status: 'Preparing',
      addedDate: new Date().toISOString().split('T')[0],
      targetDeadline: scholarship.deadline,
      notes: `Targeting application for ${scholarship.institution}. Focus on initial requirements.`,
      checklist: scholarship.requiredDocuments.map((doc, idx) => ({
        id: `chk-${idx}`,
        label: doc,
        completed: false
      })),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setApplications((prev) => [newApp, ...prev]);
    addToast('Added to Portfolio', `${scholarship.title} added to Preparing column.`, 'success');
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status,
              lastUpdated: new Date().toISOString().split('T')[0],
              submissionDate: status === 'Submitted' ? new Date().toISOString().split('T')[0] : app.submissionDate
            }
          : app
      )
    );

    const app = applications.find((a) => a.id === appId);
    const sch = scholarships.find((s) => s.id === app?.scholarshipId);
    const name = sch ? sch.title : 'Application';

    if (status === 'Approved') {
      addToast('Congratulations!', `${name} status updated to Approved!`, 'celebration');
    } else {
      addToast('Status Updated', `${name} moved to "${status}".`, 'info');
    }
  };

  const updateApplicationNotes = (appId: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, notes, lastUpdated: new Date().toISOString().split('T')[0] } : app
      )
    );
  };

  const toggleChecklistItem = (appId: string, checklistId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newChecklist = app.checklist.map((item) =>
          item.id === checklistId ? { ...item, completed: !item.completed } : item
        );
        return {
          ...app,
          checklist: newChecklist,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      })
    );
  };

  const deleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== appId));
    addToast('Application Removed', 'Removed application from tracker.', 'info');
  };

  const resetFilters = () => {
    setFilterState(initialFilters);
  };

  const toggleComparison = (scholarshipId: string) => {
    setComparisonList((prev) => {
      if (prev.includes(scholarshipId)) {
        return prev.filter((id) => id !== scholarshipId);
      }
      if (prev.length >= 3) {
        addToast('Comparison Limit', 'You can compare up to 3 endowments at a time.', 'warning');
        return prev;
      }
      addToast('Added to Comparison', 'Scholarship added to comparison matrix.', 'info');
      return [...prev, scholarshipId];
    });
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const isCompared = (scholarshipId: string) => comparisonList.includes(scholarshipId);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        theme,
        toggleTheme,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        studentProfile,
        updateStudentProfile,
        applications,
        addApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        toggleChecklistItem,
        deleteApplication,
        selectedScholarship,
        setSelectedScholarship,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        addToast,
        removeToast,
        filterState,
        setFilterState,
        resetFilters,
        scholarships,
        comparisonList,
        toggleComparison,
        clearComparison,
        isCompared,
        isComparisonOpen,
        setIsComparisonOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
