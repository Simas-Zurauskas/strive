'use client';
import { H2 } from '@/components/typography';
import { useAuth } from '@/hooks/useAuth';

const HomeScreen = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <H2 className="text-3xl font-bold mb-6">Home</H2>
      Hi :)
    </div>
  );
};

export default HomeScreen;
