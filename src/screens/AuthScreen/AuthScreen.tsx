'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/NavBar/comps';

function AuthContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred during authentication';

      if (error === 'auth_failed') {
        errorMessage = 'Authentication failed. Please try again.';
      } else if (error === 'auth_error') {
        errorMessage = 'Authentication service error. Please try again later.';
      }

      toast.error(errorMessage, {
        richColors: true,
        duration: 6000,
      });
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch (error) {
      toast.error('Error signing in with Google', {
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white/90 dark:bg-black/80 border-amber-300 dark:border-amber-500/20 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2">
          <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 dark:from-amber-500 dark:to-yellow-400 text-white dark:text-black text-xs font-medium rounded-full">
            AI-Powered Learning Platform
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-amber-50">Sign in to Strive</CardTitle>
        <CardDescription className="text-gray-600 dark:text-amber-200/70">
          Continue with Google to access your learning roadmaps
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="flex items-center gap-2 h-12 bg-gradient-to-r from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-300 dark:border-amber-500/40 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 dark:hover:from-amber-500/20 dark:hover:to-orange-500/20 text-gray-800 dark:text-amber-50 hover:text-amber-700 dark:hover:text-amber-400 transition-all duration-300"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <div className="flex items-center justify-center w-5 h-5 relative text-amber-600 dark:text-amber-400">
            <span className="absolute w-full h-full flex items-center justify-center">
              <FaGoogle />
            </span>
          </div>
          <span>Continue with Google</span>
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center text-sm text-gray-500 dark:text-amber-200/60">
        <div>
          By continuing, you agree to our{' '}
          <Link
            href="#"
            className="underline underline-offset-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="#"
            className="underline underline-offset-4 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  );
}

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
