'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { H2 } from '@/components/typography';
import { Button } from '@/components/ui';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { useQueryClient } from '@tanstack/react-query';
import { QKeys } from '@/types';

function StripeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { credits } = useCredits();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(true);
  const [addedCredits, setAddedCredits] = useState(0);

  useEffect(() => {
    // Refetch credits after successful payment
    if (sessionId) {
      // Invalidate and refetch credits
      queryClient.invalidateQueries({ queryKey: [QKeys.CREDITS] });

      // Add credits via our endpoint (simulates webhook)
      const addCreditsManually = async () => {
        try {
          // Get credit amount from sessionStorage (set during checkout)
          const creditAmount = sessionStorage.getItem('purchased_credits') || '20';
          const creditsToAdd = parseInt(creditAmount);

          const response = await fetch('/api/stripe/test-add-credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              credits: creditsToAdd,
              sessionId: sessionId,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`Credits added successfully: ${creditsToAdd}`);
            setAddedCredits(creditsToAdd);

            // Refetch credits after adding
            queryClient.invalidateQueries({ queryKey: [QKeys.CREDITS] });

            // Clear the sessionStorage
            sessionStorage.removeItem('purchased_credits');
          } else if (response.status === 409) {
            // Session already processed
            console.log('Session already processed, showing success without adding credits');
            setAddedCredits(0);
          } else {
            console.error('Failed to add credits');
          }
        } catch (error) {
          console.error('Error adding credits:', error);
        }
      };

      // Add credits after a short delay, then stop loading
      setTimeout(async () => {
        await addCreditsManually();
        setIsProcessing(false);
      }, 2000);
    }
  }, [sessionId, queryClient]);

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-[color:var(--strive)]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-8 h-8 text-[color:var(--strive)] animate-spin" />
        </div>

        <H2 className="text-2xl font-bold text-[color:var(--strive)] mb-4">Processing Payment...</H2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">Please wait while we add your credits to your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>

      <H2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">Payment Successful!</H2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        {addedCredits > 0 ? (
          <>
            <span className="font-semibold text-green-600 dark:text-green-400">+{addedCredits} credits</span> have been
            added to your account! You can now continue creating your personalized learning roadmaps.
          </>
        ) : (
          'Your credits have been added to your account. You can now continue creating your personalized learning roadmaps.'
        )}
      </p>

      <div className="bg-gradient-to-r from-[color:var(--strive)]/20 to-[color:var(--strive)]/10 rounded-lg p-4 mb-6 border border-[color:var(--strive)]/20">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold">Current Credits:</span>
          <span className="text-2xl font-bold text-[color:var(--strive)]">{credits}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => router.push('/profile')}
          className="bg-[color:var(--strive)] hover:bg-[color:var(--strive)]/90"
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
}

export default function StripeSuccess() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <div className="bg-[color:var(--strive)]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-[color:var(--strive)] animate-spin" />
          </div>
          <H2 className="text-2xl font-bold text-[color:var(--strive)] mb-4">Loading...</H2>
        </div>
      }
    >
      <StripeSuccessContent />
    </Suspense>
  );
}
