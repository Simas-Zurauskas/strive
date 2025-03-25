import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui';
import { IoWarningOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import axios from 'axios';

interface EmailVerificationWarningProps {
  email: string;
}

export const EmailVerificationWarning: React.FC<EmailVerificationWarningProps> = ({ email }) => {
  const [isSending, setIsSending] = useState(false);

  const handleResendVerification = async () => {
    try {
      setIsSending(true);
      // Here we would call an API endpoint to resend the verification email
      // This endpoint would need to be implemented
      await axios.post('/api/auth/resend-verification', { email });

      toast.success('Verification email sent! Please check your inbox.', {
        richColors: true,
      });
    } catch (error) {
      toast.error('Failed to send verification email. Please try again later.', {
        richColors: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="p-6 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
          <IoWarningOutline className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-amber-100">Email Verification Required</h2>

        <p className="text-gray-600 dark:text-amber-200/80 max-w-md">
          Before you can create or edit courses, please verify your email address. We've sent a verification link to{' '}
          <span className="font-medium text-amber-700 dark:text-amber-300">{email}</span>.
        </p>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 w-full max-w-sm">
          <div className="text-sm">
            <p className="font-medium">Check your email inbox</p>
            <p className="text-gray-500 dark:text-gray-400">Click the verification link we sent you</p>
          </div>
        </div>

        <div className="flex flex-col  gap-3 w-full max-w-sm">
          <Button type="button" onClick={handleResendVerification} disabled={isSending} className="w-full">
            {isSending ? 'Sending...' : 'Resend Email'}
          </Button>

          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            I've Verified My Email
          </Button>
        </div>
      </div>
    </Card>
  );
};
