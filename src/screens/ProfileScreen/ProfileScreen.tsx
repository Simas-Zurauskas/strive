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
import { redirectToCheckout } from '@/lib/stripe';

const ProfileScreen = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
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

  const handleBuyCredits = async (credits: 20 | 50) => {
    try {
      setIsLoadingPayment(true);
      await redirectToCheckout(credits);
    } catch (error) {
      toast.error('Failed to redirect to checkout', { richColors: true });
    } finally {
      setIsLoadingPayment(false);
    }
  };

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
              <div className="h-3 sm:h-4" />
              <div className="bg-gradient-to-r from-slate-100/80 to-slate-50/60 dark:from-slate-900/50 dark:to-slate-800/30 rounded-lg p-3 sm:p-4 border border-slate-200 dark:border-slate-700/40 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-[color:var(--strive)]/15 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[color:var(--strive)]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Need more credits?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuyCredits(20)}
                    disabled={isLoadingPayment}
                    className="group relative overflow-hidden rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3 hover:border-[color:var(--strive)]/60 dark:hover:border-[color:var(--strive)]/40 hover:bg-[color:var(--strive)]/5 dark:hover:bg-[color:var(--strive)]/10 transition-all duration-200 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">20 Credits</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Basic pack</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[color:var(--strive)]">€5</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">€0.25 each</div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[color:var(--strive)]/20 to-[color:var(--strive)]/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                    {isLoadingPayment && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-[color:var(--strive)] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => handleBuyCredits(50)}
                    disabled={isLoadingPayment}
                    className="group relative overflow-hidden rounded-md bg-gradient-to-br from-[color:var(--strive)]/8 to-[color:var(--strive)]/15 dark:from-[color:var(--strive)]/10 dark:to-[color:var(--strive)]/20 border border-[color:var(--strive)]/30 dark:border-[color:var(--strive)]/30 p-3 hover:from-[color:var(--strive)]/15 hover:to-[color:var(--strive)]/25 dark:hover:from-[color:var(--strive)]/20 dark:hover:to-[color:var(--strive)]/30 transition-all duration-200 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">50 Credits</span>
                          <span className="text-xs bg-[color:var(--strive)]/25 text-[color:var(--strive)] dark:bg-[color:var(--strive)]/20 dark:text-[color:var(--strive)] px-1.5 py-0.5 rounded-full font-medium">
                            Best Value
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Premium pack</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[color:var(--strive)]">€10</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">€0.20 each</div>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[color:var(--strive)]/40 to-[color:var(--strive)]/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                    {isLoadingPayment && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-[color:var(--strive)] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
                  Secure payment powered by Stripe
                </div>
              </div>
              <div className="mt-2 pt-2">
                <span className="text-xs text-muted-foreground">
                  Questions about this project? Contact the developer:{' '}
                  <Link
                    href="https://www.linkedin.com/in/simas-zurauskas/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-primary hover:text-primary/80 transition-colors"
                  >
                    Simas Zurauskas
                  </Link>
                </span>
              </div>
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
