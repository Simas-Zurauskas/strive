import { P } from '@/components/typography';
import { Button } from '@/components/ui';
import React from 'react';

interface NoContentProps {
  onGenerateContent: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export const NoContent: React.FC<NoContentProps> = ({ onGenerateContent, isGenerating, canGenerate }) => {
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
        {canGenerate ? (
          <>
            <P className="text-muted-foreground max-w-md mx-auto mb-6">
              This lesson is ready to be created for your personalized learning path. Generate now to continue building
              your skills.
            </P>

            <Button onClick={onGenerateContent} disabled={isGenerating} className="flex items-center gap-2">
              Generate Content
            </Button>
          </>
        ) : (
          <>
            <P className="text-muted-foreground max-w-lg mx-auto mb-6">
              You need to generate the previous lesson first. Learning content must be created in sequence to maintain a
              coherent learning path.
            </P>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-md flex items-center gap-2 max-w-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Generate preceding lessons to unlock this content.</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
