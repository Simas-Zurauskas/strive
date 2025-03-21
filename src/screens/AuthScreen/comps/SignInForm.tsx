'use client';

import { Button } from '@/components/ui';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      console.error('Error signing in with Google', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? (
          'Loading...'
        ) : (
          <>
            <FcGoogle className="mr-2" size={24} />
            Sign in with Google
          </>
        )}
      </Button>
    </div>
  );
};
