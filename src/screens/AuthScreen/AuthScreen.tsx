'use client';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/NavBar/comps';
import AuthContent from './AuthContent';

const AuthScreen = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
      {/* Background with grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          data-dark-style={{
            backgroundImage:
              'linear-gradient(to right, rgba(64, 64, 64, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(64, 64, 64, 0.15) 1px, transparent 1px)',
          }}
        ></div>
      </div>

      {/* Spotlight gradients for both modes - keeping amber/orange/yellow for both */}
      <div className="absolute top-[20%] left-[15%] w-[35rem] h-[35rem] bg-amber-500/15 dark:bg-amber-500/30 rounded-full blur-[7rem] z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-[10%] right-[15%] w-[30rem] h-[30rem] bg-orange-500/15 dark:bg-orange-500/30 rounded-full blur-[7rem] z-0 animate-pulse-slower"></div>
      <div className="absolute top-[40%] right-[30%] w-[25rem] h-[25rem] bg-yellow-400/15 dark:bg-yellow-400/30 rounded-full blur-[7rem] z-0 animate-pulse-slow"></div>

      {/* Theme Toggle in top right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Suspense fallback={<p className="relative z-10 text-gray-800 dark:text-amber-200">Loading...</p>}>
        <div className="relative z-10">
          <AuthContent />
        </div>
      </Suspense>
    </div>
  );
};

export default AuthScreen;
