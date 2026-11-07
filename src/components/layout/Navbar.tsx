import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { 
  Compass, 
  Sparkles, 
  LayoutDashboard, 
  FolderKanban, 
  Bookmark, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X,
  FileText,
  Globe
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    theme, 
    toggleTheme, 
    bookmarks, 
    setIsCommandPaletteOpen 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: 'landing', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'discovery', label: 'Scholarships', icon: <Compass className="w-4 h-4" /> },
    { id: 'universe', label: '3D Universe', icon: <Globe className="w-4 h-4" />, tag: '3D' },
    { id: 'wizard', label: 'Eligibility Engine', icon: <Sparkles className="w-4 h-4" />, tag: 'Match' },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'applications', label: 'Applications', icon: <FolderKanban className="w-4 h-4" /> }
  ];

  const handleNavClick = (view: ActiveView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#0F1216]/90 backdrop-blur-md border-b border-[#E5E0D4] dark:border-[#2A3340] transition-colors duration-200">
      {/* Top Editorial Ticker Bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 text-[11px] font-mono tracking-wider uppercase text-[#7E8B99] dark:text-[#7A8796] border-b border-[#E5E0D4]/60 dark:border-[#2A3340]/60">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
          <span>DISPATCH NO. 104 • GLOBAL ENDOWMENTS & FELLOWSHIPS</span>
        </div>
        <div className="flex items-center gap-4">
          <span>GLOBAL TRUST REPOSITORY</span>
          <span>•</span>
          <span>VERIFIED COHORTS 2026/2027</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="cursor-pointer group flex items-center gap-3 select-none"
        >
          <div className="w-9 h-9 rounded-sm bg-[#12161A] dark:bg-[#F7F5F0] text-[#F7F5F0] dark:text-[#12161A] flex items-center justify-center font-serif font-bold text-lg border border-[#C5A880]/40 group-hover:border-[#C5A880] transition-colors">
            G
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl tracking-tight text-[#12161A] dark:text-[#F7F5F0]">
              GRANTLY
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#7E8B99] dark:text-[#7A8796] -mt-1">
              Endowment Intelligence
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-sm font-medium rounded-sm transition-all duration-150 flex items-center gap-2 relative ${
                  isActive
                    ? 'text-[#12161A] dark:text-[#F7F5F0] bg-[#EBE5D9]/60 dark:bg-[#242C37]'
                    : 'text-[#4A5562] dark:text-[#B6C0CC] hover:text-[#12161A] dark:hover:text-[#F7F5F0] hover:bg-[#F3EFE7] dark:hover:bg-[#161B22]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.tag && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono tracking-wide uppercase bg-[#C5A880]/20 text-[#8C6B38] dark:text-[#E0C8A4] rounded">
                    {item.tag}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#2C4E6F] dark:bg-[#5C88B5]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Command Palette, Bookmarks, Theme, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search / Command Palette Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#7E8B99] dark:text-[#7A8796] bg-[#F3EFE7] dark:bg-[#1B2129] border border-[#E5E0D4] dark:border-[#2A3340] rounded hover:border-[#D1C9BC] dark:hover:border-[#384556] transition-colors"
            title="Open Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#4A5562] dark:text-[#B6C0CC]" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#0F1216] border border-[#E5E0D4] dark:border-[#2A3340] rounded text-[#4A5562] dark:text-[#B6C0CC]">
              ⌘K
            </kbd>
          </button>

          {/* Dossier / Bookmarks Button */}
          <button
            onClick={() => handleNavClick('discovery')}
            className="relative p-2 text-[#4A5562] dark:text-[#B6C0CC] hover:text-[#12161A] dark:hover:text-[#F7F5F0] hover:bg-[#F3EFE7] dark:hover:bg-[#161B22] rounded transition-colors"
            title="Saved Grants"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-mono font-bold bg-[#2C4E6F] text-white rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Dark/Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[#4A5562] dark:text-[#B6C0CC] hover:text-[#12161A] dark:hover:text-[#F7F5F0] hover:bg-[#F3EFE7] dark:hover:bg-[#161B22] rounded transition-colors"
            aria-label="Toggle visual theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#2C4E6F]" />
            ) : (
              <Sun className="w-4 h-4 text-[#E0C8A4]" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4A5562] dark:text-[#B6C0CC] hover:bg-[#F3EFE7] dark:hover:bg-[#161B22] rounded"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E0D4] dark:border-[#2A3340] bg-[#FAF8F5] dark:bg-[#0F1216] px-4 pt-3 pb-6 space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded ${
                  isActive
                    ? 'bg-[#2C4E6F] text-white'
                    : 'text-[#12161A] dark:text-[#F7F5F0] hover:bg-[#F3EFE7] dark:hover:bg-[#161B22]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#C5A880]/20 text-[#8C6B38]'
                  }`}>
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

