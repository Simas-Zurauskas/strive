import type { Metadata } from 'next';
import { Geist, Jost } from 'next/font/google';
import './globals.css';
import Registry from './_registry/Registry';
import CookieBanner from '@/components/CookieBanner';

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Strive | Revolutionary AI-Powered Learning Roadmaps',
  description: `Transform your learning with Strive's AI-generated personalized roadmaps. Tailored to your goals, skills, and pace - for ambitious self-starters who demand efficiency and structure in their education journey.`,
  keywords: [
    'AI learning platform',
    'personalized education',
    'learning roadmaps',
    'self-directed learning',
    'skill mastery',
    'adaptive learning',
    'educational technology',
    'AI education',
    'proactive learning',
  ],
  authors: [{ name: 'Strive Learning' }],
  category: 'Education Technology',
  creator: 'Strive Learning',
  publisher: 'Strive Learning',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: process.env.NEXTAUTH_URL,
    title: 'Strive | Revolutionary AI-Powered Learning Roadmaps',
    description:
      'Precision-engineered learning paths tailored to your goals and skills. For ambitious learners who demand structure and efficiency in their educational journey.',
    siteName: 'Strive Learning',
    locale: 'en_US',
    images: [
      {
        url: `${process.env.NEXTAUTH_URL}/og.png`,
      },
    ],
  },
};

console.log(jost.variable);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${jost.variable} antialiased`}>
        <Registry>{children}</Registry>
        <CookieBanner />
      </body>
    </html>
  );
}
