import React from 'react';
import styled from 'styled-components';
import { H3, P, Muted } from '@/components/typography';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MailIcon, AlertCircle } from 'lucide-react';

const ContactWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
`;

const EmailLink = styled.a`
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s, transform 0.2s;
  text-decoration: underline;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

interface NoCreditsProps {}

const NoCredits: React.FC<NoCreditsProps> = () => {
  return (
    <Card className="relative border border-red-200 dark:border-red-900/30 bg-gradient-to-br from-slate-50 to-red-50/50 dark:from-slate-900/80 dark:to-red-950/10 shadow-sm overflow-hidden w-full">
      <div className="absolute h-1 top-0 left-0 right-0 bg-gradient-to-r from-red-300 via-red-400 to-red-300 opacity-80 dark:opacity-60"></div>
      <CardHeader className="pb-0">
        <InfoHeader>
          <AlertCircle className="h-4 w-4 text-red-400 dark:text-red-500" />
          <H3 className="text-slate-700 dark:text-slate-300 text-lg">Credits Needed</H3>
        </InfoHeader>
      </CardHeader>
      <i>
        <CardContent>
          <P className="text-slate-600 dark:text-slate-400 text-sm text-left">
            Additional <span className="font-medium">credits</span> are needed for this feature.
          </P>
          <P className="text-slate-600 dark:text-slate-400 text-sm text-left">
            If you find the app useful, please contact us.
          </P>
          <ContactWrapper>
            <EmailLink href="mailto:admin@strive-learning.com" target="_blank">
              admin@strive-learning.com
            </EmailLink>
          </ContactWrapper>
        </CardContent>
      </i>
    </Card>
  );
};

export default NoCredits;
