import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sparkles, 
  Compass, 
  LayoutDashboard, 
  FolderKanban, 
  Sun, 
  Moon, 
  ArrowRight,
  GraduationCap,
  Globe
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    setCurrentView, 
    scholarships, 
    setSelectedScholarship, 
    theme, 
    toggleTheme,
    setFilterState
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter scholarships
  const matchingScholarships = scholarships.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.institution.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.fields.some((f) => f.toLowerCase().includes(q)) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  // Quick navigation items
  const quickActions = [
    {
      id: 'nav-disc',
      label: 'Explore Scholarship Discovery Directory',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />,
      action: () => setCurrentView('discovery')
    },
    {
      id: 'nav-univ',
      label: 'Explore 3D Opportunity Universe',
      category: '3D Experience',
      icon: <Globe className="w-4 h-4 text-[#C5A880]" />,
      action: () => setCurrentView('universe')
    },
    {
      id: 'nav-wiz',
      label: 'Launch Intelligent Eligibility Engine',
      category: 'Engine',
      icon: <Sparkles className="w-4 h-4 text-[#C5A880]" />,
      action: () => setCurrentView('wizard')
    },
    {
      id: 'nav-dash',
      label: 'Open Scholar Portfolio Dashboard',
      category: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />,
      action: () => setCurrentView('dashboard')
    },
    {
      id: 'nav-apps',
      label: 'Open Application Tracking Portfolio',
      category: 'Portfolio',
      icon: <FolderKanban className="w-4 h-4 text-[#7E8B99]" />,
      action: () => setCurrentView('applications')
    },
    {
      id: 'act-theme',
      label: `Switch to ${theme === 'light' ? 'Midnight Ink' : 'Warm Ivory'} Theme`,
      category: 'Preferences',
      icon: theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#E0C8A4]" />,
      action: () => toggleTheme()
    },
    {
      id: 'act-filter-full',
      label: 'Filter: Full Tuition & Living Grants',
      category: 'Quick Filter',
      icon: <GraduationCap className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5]" />,
      action: () => {
        setFilterState((prev) => ({ ...prev, coverage: 'Full Tuition & Living' }));
        setCurrentView('discovery');
      }
    }
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  const allItems = [
    ...matchingScholarships.map((s) => ({
      id: s.id,
      type: 'scholarship' as const,
      title: s.title,
      subtitle: `${s.institution} • ${s.amountFormatted}`,
      scholarship: s
    })),
    ...quickActions.map((a) => ({
      id: a.id,
      type: 'action' as const,
      title: a.label,
      subtitle: a.category,
      action: a.action,
      icon: a.icon
    }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'scholarship') {
          setSelectedScholarship(current.scholarship);
        } else if (current.type === 'action') {
          current.action();
        }
        setIsCommandPaletteOpen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl bg-[#FAF8F5] dark:bg-[#161B22] border border-[#E5E0D4] dark:border-[#2A3340] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E5E0D4] dark:border-[#2A3340]">
          <Search className="w-5 h-5 text-[#7E8B99] dark:text-[#7A8796] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a scholarship, university, field, or command..."
            className="w-full bg-transparent text-sm text-[#12161A] dark:text-[#F7F5F0] placeholder:text-[#7E8B99] focus:outline-none"
          />
          <kbd 
            onClick={() => setIsCommandPaletteOpen(false)}
            className="cursor-pointer text-[10px] font-mono px-2 py-0.5 bg-[#EBE5D9] dark:bg-[#242C37] text-[#4A5562] dark:text-[#B6C0CC] rounded"
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#E5E0D4]/40 dark:divide-[#2A3340]/40">
          {allItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#7E8B99] dark:text-[#7A8796]">
              No matching grants or commands found for "{query}".
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.type === 'scholarship') {
                      setSelectedScholarship(item.scholarship);
                    } else {
                      item.action();
                    }
                    setIsCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#EBE5D9] dark:bg-[#242C37] text-[#12161A] dark:text-[#F7F5F0]'
                      : 'text-[#4A5562] dark:text-[#B6C0CC]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.type === 'scholarship' ? (
                      <GraduationCap className="w-4 h-4 text-[#2C4E6F] dark:text-[#5C88B5] shrink-0" />
                    ) : (
                      item.icon
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-[#12161A] dark:text-[#F7F5F0]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#7E8B99] dark:text-[#7A8796] truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 text-[#7E8B99] shrink-0 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="px-4 py-2 bg-[#F3EFE7] dark:bg-[#0F1216] border-t border-[#E5E0D4] dark:border-[#2A3340] flex items-center justify-between text-[11px] font-mono text-[#7E8B99] dark:text-[#7A8796]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <div>GRANTLY DISCOVERY SYSTEM</div>
        </div>
      </div>
    </div>
  );
};
