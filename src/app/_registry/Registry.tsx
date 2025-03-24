'use client';
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import { ThemeProvider } from 'styled-components';
import { createTheme, GlobalStyles, Scheme } from '@/lib/theme';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

const ThemeRegistry: React.FC<Props> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <ThemeProvider theme={createTheme(theme as Scheme)}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

const Registry: React.FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
        <ThemeRegistry>
          <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
            {children}
          </SessionProvider>
        </ThemeRegistry>
      </NextThemeProvider>
    </QueryClientProvider>
  );
};

export default Registry;
