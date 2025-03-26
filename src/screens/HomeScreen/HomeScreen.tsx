'use client';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '@/requests/course';
import { QKeys } from '@/types';
import Loader from '@/components/Loader';
import { HeroSection, HowItWorksSection } from './comps';
import EmailVerificationWarning from '@/components/EmailVerificationWarning';

const HomeScreen = () => {
  const { user } = useAuth();

  const { data: courses, isLoading } = useQuery({
    queryKey: [QKeys.COURSES],
    queryFn: () => getCourses(),
  });

  if (!user) return null;

  const hasExistingCourses = Boolean(courses && courses.length > 0);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-10">
      <HeroSection userName={user.name || ''} hasExistingCourses={hasExistingCourses} />
      {!user.emailVerified && <EmailVerificationWarning />}
      <HowItWorksSection />
    </div>
  );
};

export default HomeScreen;
