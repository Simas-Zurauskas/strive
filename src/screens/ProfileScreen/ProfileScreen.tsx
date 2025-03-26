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
      <div className="max-w-6xl mx-auto py-6 px-4">
        <H2 className="mb-6">Your Profile</H2>
        <Section title={user.name} description={user.email} verticalGutter>
          <CardContent className="flex justify-end flex-col items-start gap-2">
            <div className="flex flex-col leading-tight">
              <div className="flex items-center mb-2">
                <div className="bg-gradient-to-r from-[color:var(--strive)]/20 to-[color:var(--strive)]/10 rounded-lg p-3 border border-[color:var(--strive)]/20 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[color:var(--strive)]/15 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[color:var(--strive)]"
                      >
                        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                        <path d="M12 7c1-.56 2.78-2 5-2 .97 0 1.87.3 2.67.8" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground font-medium">Credits</span>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-[color:var(--strive)]">{credits}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span className="text-md text-muted-foreground italic mt-2">
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
            <div className="h-4" />
            <Link href="/terms-of-service" className="underline text-md transition-colors" target="_blank">
              Terms of Service
            </Link>{' '}
            <Link href="/privacy-policy" className="underline text-md transition-colors" target="_blank">
              Privacy Policy
            </Link>
            <div className="h-4" />
            <div className="flex gap-2 w-full justify-between">
              <Button onClick={() => signOut()} disabled={isPending}>
                Logout
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteOpen(true)} disabled={isPending}>
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
