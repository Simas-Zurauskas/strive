'use client';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/NavBar/comps';
import {
  Bg,
  HeroMarketing,
  ExamplesSection,
  CustomizationSection,
  ProcessFlowSection,
  VisualRoadmapDemo,
} from './comps';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/NavBar';
import AuthContent from './AuthContent';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/components/Logo';

const LandingScreen = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Render Navbar for authenticated users, or theme toggle for guests */}
      {isAuthenticated ? (
        <Navbar />
      ) : (
        <div className="pt-4 px-4 z-10 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2 ">
            <Logo withPiskiukai size="lg" />
            <h1 className="text-2xl font-semibold" style={{ fontFamily: 'jost', letterSpacing: '0.05em' }}>
              STRIVE
            </h1>
          </div>
          <ThemeToggle />
        </div>
      )}

      <Bg />

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-6 sm:pb-8 md:pb-16 min-h-[90vh] sm:min-h-screen flex items-center pt-16 sm:pt-0">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8 lg:gap-4">
          {/* Marketing content */}
          <HeroMarketing />

          {/* Auth form section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-6 lg:mt-0">
            <div className="w-full max-w-md">
              <Suspense fallback={<p className="text-gray-800 dark:text-amber-200">Loading...</p>}>
                <AuthContent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Section - shows how Strive works */}
      <div className="pt-4 sm:pt-6 md:pt-12">
        <ProcessFlowSection />
      </div>

      {/* Examples/ideas section */}
      <div className="py-4 md:py-8 bg-gray-50/30 dark:bg-gray-900/30">
        <ExamplesSection />
      </div>

      {/* Customization Section */}
      <div className="py-4 md:py-8">
        <CustomizationSection />
      </div>

      {/* Visual Roadmap Demo - showing a visualization of learning paths */}
      <div className="py-4 sm:py-6 md:py-12 mb-4 sm:mb-6 bg-gray-50/30 dark:bg-gray-900/30">
        <VisualRoadmapDemo />
      </div>

      {/* Bottom credits */}
      <div className="relative z-10 w-full text-center py-4 sm:py-6 mt-auto">
        <p className="text-xs text-gray-600 dark:text-amber-200/40">
          © {new Date().getFullYear()} Strive Learning. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
