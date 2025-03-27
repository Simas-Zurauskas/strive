'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CookieBannerProps {
  className?: string;
}

export function CookieBanner({ className }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookie-consent');
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent for 6 months (in milliseconds)
    const sixMonthsFromNow = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString();
    localStorage.setItem('cookie-consent', sixMonthsFromNow);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 sm:bottom-4 right-0 sm:right-4 w-full sm:max-w-sm p-3 sm:p-4 bg-white dark:bg-zinc-900 sm:rounded-lg shadow-lg border-t sm:border border-zinc-200 dark:border-zinc-800 z-50 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-5',
        className,
      )}
    >
      <p className="mb-2 sm:mb-3">This site uses essential cookies to ensure you get the best experience.</p>
      <div className="flex justify-end">
        <Button size="sm" onClick={acceptCookies}>
          Accept
        </Button>
      </div>
    </div>
  );
}

export default CookieBanner;
