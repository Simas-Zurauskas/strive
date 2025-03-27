import Navbar from '@/components/NavBar';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto py-4 sm:py-5 md:py-6 px-3 sm:px-4">{children}</div>
    </>
  );
};

export default Layout;
