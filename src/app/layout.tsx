import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Registry from './_registry/Registry';
import CookieBanner from '@/components/CookieBanner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Strive | AI-Powered Learning Platform',
  description: 'Personalized AI-Driven Learning Journeys',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <Registry>{children}</Registry>
        <CookieBanner />
      </body>
    </html>
  );
}
