import React from 'react';
import { Card } from '../ui/card';
import { H2 } from '../typography';
import { Loader } from 'lucide-react';

interface SectionProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  verticalGutter?: boolean;
  isLoading?:
    | {
        message?: string;
      }
    | false;
  bottomComponent?: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  verticalGutter,
  isLoading,
  bottomComponent,
}) => {
  return (
    <Card className="p-0 border shadow-md overflow-hidden rounded-xl gap-0 relative">
      {isLoading && (
        <div
          className="absolute inset-0 bg-black/10 dark:bg-black/40 flex items-center justify-center z-1000"
          style={{ backdropFilter: 'blur(1px)' }}
        >
          <div className="bg-card p-4 rounded-lg shadow-md flex items-center gap-2 border">
            <Loader className="w-5 h-5 animate-[spin_2s_linear_infinite] text-primary" />
            <span className="text-sm font-medium text-foreground">{isLoading.message || 'Loading'}</span>
          </div>
        </div>
      )}
      <div className="">
        <div className="flex items-center justify-between">
          <div className="px-2 w-full p-4 relative overflow-hidden rounded-t-lg bg-gradient-to-r from-transparent via-slate-100/40 to-transparent dark:via-white/5 after:absolute after:inset-0 after:bg-gradient-to-br after:from-slate-200/50 after:to-transparent dark:after:from-white/10 after:opacity-50 dark:after:opacity-30 border-b border-slate-200/60 dark:border-slate-800/50">
            <div className="relative z-10 p-3 sm:p-3 md:p-3">
              <H2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 md:mb-2">{title}</H2>
              <p className="text-sm md:text-sm text-muted-foreground">{description}</p>
              {bottomComponent && <div className="mt-2 md:mt-4">{bottomComponent}</div>}
            </div>
          </div>
        </div>
      </div>
      {children && (
        <div className="border-t">
          {verticalGutter && <div className="mt-2 md:mt-4" />}
          {children}
          {verticalGutter && <div className="mt-3 md:mt-6" />}
        </div>
      )}
    </Card>
  );
};
