import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';

// Validation schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SigninSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

interface FormProps {
  callbackUrl: string;
  onAuthModeChange?: (mode: 'signin' | 'signup') => void;
}

export const Form: React.FC<FormProps> = ({ callbackUrl, onAuthModeChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Call the onAuthModeChange prop when authMode changes
  useEffect(() => {
    if (onAuthModeChange) {
      onAuthModeChange(authMode);
    }
  }, [authMode, onAuthModeChange]);

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

  // Sign up form
  const signupFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Register user
        const response = await axios.post('/api/auth/register', {
          name: values.name,
          email: values.email,
          password: values.password,
        });

        if (response.data.success) {
          toast.success('Account created successfully!', {
            richColors: true,
          });

          // Auto sign in after successful registration
          const result = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
          });

          if (result?.error) {
            toast.error('Account created but automatic login failed. Please sign in manually.', {
              richColors: true,
            });
            resetForm();
            setAuthMode('signin');
          } else {
            // Redirect to callback URL on successful login
            window.location.href = callbackUrl;
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to create account', {
          richColors: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Sign in form
  const signinFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SigninSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password,
        });

        if (result?.error) {
          toast.error('Invalid email or password', {
            richColors: true,
          });
        } else {
          window.location.href = callbackUrl;
        }
      } catch (error) {
        toast.error('An error occurred during sign in', {
          richColors: true,
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Google Sign In Button */}
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-700"></span>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white dark:bg-black text-gray-500 dark:text-gray-400">Or continue with email</span>
        </div>
      </div>

      {/* Sign Up Form */}
      {authMode === 'signup' ? (
        <form onSubmit={signupFormik.handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              onChange={signupFormik.handleChange}
              onBlur={signupFormik.handleBlur}
              value={signupFormik.values.name}
              className={`w-full px-3 py-2 rounded-md border ${
                signupFormik.touched.name && signupFormik.errors.name
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signupFormik.touched.name && signupFormik.errors.name && (
              <p className="text-xs text-red-500">{signupFormik.errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              onChange={signupFormik.handleChange}
              onBlur={signupFormik.handleBlur}
              value={signupFormik.values.email}
              className={`w-full px-3 py-2 rounded-md border ${
                signupFormik.touched.email && signupFormik.errors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signupFormik.touched.email && signupFormik.errors.email && (
              <p className="text-xs text-red-500">{signupFormik.errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={signupFormik.handleChange}
              onBlur={signupFormik.handleBlur}
              value={signupFormik.values.password}
              className={`w-full px-3 py-2 rounded-md border ${
                signupFormik.touched.password && signupFormik.errors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signupFormik.touched.password && signupFormik.errors.password && (
              <p className="text-xs text-red-500">{signupFormik.errors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              onChange={signupFormik.handleChange}
              onBlur={signupFormik.handleBlur}
              value={signupFormik.values.confirmPassword}
              className={`w-full px-3 py-2 rounded-md border ${
                signupFormik.touched.confirmPassword && signupFormik.errors.confirmPassword
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signupFormik.touched.confirmPassword && signupFormik.errors.confirmPassword && (
              <p className="text-xs text-red-500">{signupFormik.errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={signupFormik.isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-md transition-colors"
          >
            {signupFormik.isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      ) : (
        /* Sign In Form */
        <form onSubmit={signinFormik.handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="signin-email" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              onChange={signinFormik.handleChange}
              onBlur={signinFormik.handleBlur}
              value={signinFormik.values.email}
              className={`w-full px-3 py-2 rounded-md border ${
                signinFormik.touched.email && signinFormik.errors.email
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signinFormik.touched.email && signinFormik.errors.email && (
              <p className="text-xs text-red-500">{signinFormik.errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="signin-password" className="text-sm font-medium text-gray-700 dark:text-amber-100">
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={signinFormik.handleChange}
              onBlur={signinFormik.handleBlur}
              value={signinFormik.values.password}
              className={`w-full px-3 py-2 rounded-md border ${
                signinFormik.touched.password && signinFormik.errors.password
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-700'
              } bg-white dark:bg-gray-900 text-gray-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400`}
            />
            {signinFormik.touched.password && signinFormik.errors.password && (
              <p className="text-xs text-red-500">{signinFormik.errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={signinFormik.isSubmitting}
            className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-md transition-colors"
          >
            {signinFormik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      )}

      <div className="text-center text-sm text-gray-700 dark:text-amber-200/70">
        {authMode === 'signin' ? (
          <span>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
            >
              Sign up
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium"
            >
              Sign in
            </button>
          </span>
        )}
      </div>
    </div>
  );
};
