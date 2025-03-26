import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Form } from './';

const AuthContent = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred during authentication';

      if (error === 'auth_failed') {
        errorMessage = 'Authentication failed. Please try again.';
      } else if (error === 'auth_error') {
        errorMessage = 'Authentication service error. Please try again later.';
      }

      toast.error(errorMessage, { richColors: true });
    }
  }, [error]);

  return (
    <Card className="w-full max-w-md bg-white/90 dark:bg-black/80 border-amber-300 dark:border-amber-500/20 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-amber-50">
          {authMode === 'signin' ? 'Sign in to Strive' : 'Create an Account'}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-amber-200/70">
          {authMode === 'signin'
            ? 'Sign in to access your learning roadmaps'
            : 'Create a new account to get started with Strive'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form callbackUrl={callbackUrl} onAuthModeChange={setAuthMode} />
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center text-sm text-gray-500 dark:text-amber-200/60">
        <div>
          By continuing, you agree to our{' '}
          <Link
            href="/terms-of-service"
            className="underline underline-offset-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            target="_blank"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy-policy"
            className="underline underline-offset-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  );
};

export default AuthContent;
