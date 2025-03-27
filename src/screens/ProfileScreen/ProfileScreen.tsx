'use client';
import Alert from '@/components/Alert';
import { Section } from '@/components/layout';
import { H2 } from '@/components/typography';
import { Button, CardContent } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { destroyAccount } from '@/lib/services/userServices';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

const ProfileScreen = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { user } = useAuth();
  const { credits } = useCredits();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => destroyAccount(),
    onSuccess: () => {
      setIsDeleteOpen(false);
      signOut();
    },
    onError: () => toast.error('Failed to delete account', { richColors: true }),
  });

  if (!user) return null;

  return (
    <>
      <Alert
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={mutate}
        title="Delete Account"
        subtitle="Are you sure you want to delete your account? This action cannot be undone."
        isLoading={isPending}
      />
      <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <H2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl">Your Profile</H2>
        <Section title={user.name} description={user.email} verticalGutter>
          <CardContent className="flex justify-end flex-col items-start gap-2">
            <div className="flex flex-col leading-tight w-full">
              <div className="flex items-center mb-2 w-full">
                <div className="bg-gradient-to-r from-[color:var(--strive)]/20 to-[color:var(--strive)]/10 rounded-lg p-2 sm:p-3 border border-[color:var(--strive)]/20 shadow-sm w-full sm:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[color:var(--strive)]/15 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[color:var(--strive)]"
                      >
                        <circle cx="8" cy="8" r="6" />
                        <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                        <path d="M7 6h1v4" />
                        <path d="m16.71 13.88.7.71-2.82 2.82" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm text-muted-foreground font-medium">Credits</span>
                      <div className="flex items-baseline">
                        <span className="text-xl sm:text-2xl font-bold text-[color:var(--strive)]">{credits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-sm sm:text-md text-muted-foreground italic mt-2">
                Find the app useful? Contact{' '}
                <Link
                  href="mailto:admin@strive-learning.com"
                  target="_blank"
                  className="underline font-medium text-primary"
                >
                  admin@strive-learning.com
                </Link>{' '}
                for more credits.
              </span>
            </div>
            <div className="h-3 sm:h-4" />
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link href="/terms-of-service" className="underline text-sm sm:text-md transition-colors" target="_blank">
                Terms of Service
              </Link>{' '}
              <Link href="/privacy-policy" className="underline text-sm sm:text-md transition-colors" target="_blank">
                Privacy Policy
              </Link>
            </div>
            <div className="h-3 sm:h-4" />
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:justify-between">
              <Button onClick={() => signOut()} disabled={isPending} className="w-full sm:w-auto">
                Logout
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
                disabled={isPending}
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Section>
      </div>
    </>
  );
};

export default ProfileScreen;
