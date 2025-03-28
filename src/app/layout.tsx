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

  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',

  openGraph: {
    type: 'website',
    url: process.env.NEXTAUTH_URL,
    title: 'Strive | Revolutionary AI-Powered Learning Roadmaps',
    description:
      'Precision-engineered learning paths tailored to your goals and skills. For ambitious learners who demand structure and efficiency in their educational journey.',
    siteName: 'Strive Learning',
    images: [
      {
        url: `https://opengraph.b-cdn.net/production/images/5118e7d6-9c05-4b7d-9af8-bfdaf2b1bd6e.png?token=hV9-FuRs8S8YFseu1Zg7yk_AEkNLsvo-mtQhENYOn1I&height=630&width=1200&expires=33279103605`,
      },
    ],
  },
};

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
