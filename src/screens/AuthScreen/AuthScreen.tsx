'use client';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/NavBar/comps';
import AuthContent from './AuthContent';
import {
  Bg,
  HeroMarketing,
  ExamplesSection,
  CustomizationSection,
  ProcessFlowSection,
  VisualRoadmapDemo,
} from './comps';

const AuthScreen = () => {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <Bg />

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-8 md:pb-16 min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side - Marketing content */}
          <HeroMarketing />

          {/* Right side - Auth form */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <Suspense fallback={<p className="relative z-10 text-gray-800 dark:text-amber-200">Loading...</p>}>
              <div className="w-full max-w-md">
                <AuthContent />
              </div>
            </Suspense>
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

// Example Card Component
const ExampleCard = ({
  title,
  description,
  category,
  icon,
}: {
  title: string;
  description: string;
  category: 'Popular' | 'Specialized' | 'Unique';
  icon: string;
}) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'Popular':
        return 'bg-amber-500 dark:bg-amber-500';
      case 'Specialized':
        return 'bg-orange-500 dark:bg-orange-500';
      case 'Unique':
        return 'bg-yellow-400 dark:bg-yellow-400';
      default:
        return 'bg-amber-500 dark:bg-amber-500';
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'code':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case 'chart':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case 'product':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case 'ai':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'cloud':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
            />
          </svg>
        );
      case 'security':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case 'nature':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'strategy':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
            />
          </svg>
        );
      case 'craft':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-500/40 dark:hover:border-amber-500/30 group p-6">
      <div className="flex items-center mb-4">
        <div className={`${getCategoryColor()} p-2 rounded-lg text-white dark:text-black mr-3`}>{getIcon()}</div>
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-amber-200/50">{category}</span>
          <h3 className="font-semibold text-xl text-gray-900 dark:text-amber-50">{title}</h3>
        </div>
      </div>
      <p className="text-gray-700 dark:text-amber-200/70">{description}</p>
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
          Explore path
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default AuthScreen;
