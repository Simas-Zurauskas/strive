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
          className="absolute inset-0 bg-black/10 dark:bg-black/40 flex items-center justify-center z-10"
          style={{ backdropFilter: 'blur(1px)' }}
        >
          <div className="bg-card p-4 rounded-lg shadow-md flex items-center gap-2 border">
            <Loader className="w-5 h-5 animate-[spin_2s_linear_infinite] text-primary" />
            <span className="text-sm font-medium text-foreground">{isLoading.message || 'Loading'}</span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="px-2 w-full">
            <H2 className="text-2xl font-bold tracking-tight mb-2">{title}</H2>
            <p className="text-sm text-muted-foreground">{description}</p>
            {bottomComponent && <div className="mt-4">{bottomComponent}</div>}
          </div>
        </div>
      </div>
      {children && (
        <div className="border-t">
          {verticalGutter && <div className="mt-4" />}
          {children}
          {verticalGutter && <div className="mt-6" />}
        </div>
      )}
    </Card>
  );
};
