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
} from '../AuthScreen/comps';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '@/components/NavBar';
import AuthContent from '../AuthScreen/AuthContent';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LandingScreen = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Render Navbar for authenticated users, or theme toggle for guests */}
      {isAuthenticated ? (
        <Navbar />
      ) : (
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
      )}

      <Bg />

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-8 md:pb-16 min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Marketing content */}
          <HeroMarketing />

          {/* Auth form section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <Suspense fallback={<p className="text-gray-800 dark:text-amber-200">Loading...</p>}>
                <AuthContent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Section - shows how Strive works */}
      <div className="pt-6 md:pt-12">
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
      <div className="py-6 md:py-12 mb-6 bg-gray-50/30 dark:bg-gray-900/30">
        <VisualRoadmapDemo />
      </div>

      {/* Bottom credits */}
      <div className="relative z-10 w-full text-center py-6 mt-auto">
        <p className="text-xs text-gray-600 dark:text-amber-200/40">
          © {new Date().getFullYear()} Strive Learning. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
