import { P } from '@/components/typography';
import { Button } from '@/components/ui';
import React from 'react';

interface NoContentProps {
  onGenerateContent: () => void;
  isGenerating: boolean;
}

export const NoContent: React.FC<NoContentProps> = ({ onGenerateContent, isGenerating }) => {
  return (
    <div className="rounded-lg p-6 bg-muted/50 dark:bg-muted/20">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 dark:bg-primary/20 mb-4">
          <svg
            className="w-6 h-6 text-primary dark:text-primary-foreground"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">Content Not Generated</h3>
        <P className="text-muted-foreground max-w-md mx-auto mb-6">
          This module doesn't have any lessons yet. Generate content to start learning this topic.
        </P>

        <Button onClick={onGenerateContent} disabled={isGenerating} className="flex items-center gap-2">
          Generate Content
        </Button>
      </div>
    </div>
  );
};
