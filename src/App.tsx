import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { CustomCursor } from './components/layout/CustomCursor';
import { ToastContainer } from './components/layout/ToastContainer';
import { ScholarshipModal } from './components/discovery/ScholarshipModal';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { PhilosophySection } from './components/landing/PhilosophySection';
import { HorizontalShowcase } from './components/landing/HorizontalShowcase';
import { FeaturedGrants } from './components/landing/FeaturedGrants';
import { ScholarStories } from './components/landing/ScholarStories';

// Core Application Views
import { DiscoveryView } from './components/discovery/DiscoveryView';
import { UniverseView } from './components/universe/UniverseView';
import { EligibilityWizard } from './components/wizard/EligibilityWizard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ApplicationTracker } from './components/applications/ApplicationTracker';

export function App() {
  const { currentView } = useApp();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#0F1216] text-[#12161A] dark:text-[#F7F5F0] transition-colors duration-300">
      {/* Global Interactive Command Palette */}
      <CommandPalette />

      {/* Global Scholarship Inspection Modal */}
      <ScholarshipModal />

      {/* Toast Notification Center */}
      <ToastContainer />

      {/* Primary Editorial Navigation */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <HeroSection />
            <PhilosophySection />
            <HorizontalShowcase />
            <FeaturedGrants />
            <ScholarStories />
          </>
        )}

        {currentView === 'discovery' && <DiscoveryView />}

        {currentView === 'universe' && <UniverseView />}

        {currentView === 'wizard' && <EligibilityWizard />}

        {currentView === 'dashboard' && <StudentDashboard />}

        {currentView === 'applications' && <ApplicationTracker />}
      </main>

      {/* Editorial Journal Footer */}
      <Footer />

      {/* Desktop Fluid Magnetic Cursor */}
      <CustomCursor />
    </div>
  );
}

export default App;
