import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { BiEditAlt } from 'react-icons/bi';
import { RiSparklingLine } from 'react-icons/ri';

interface OverrideableProps {
  value: string;
  aiValue: string;
  onChange: (value: string, isOverride: boolean) => void;
  renderComponent?: (value: string) => React.ReactElement;
  editComponent?: () => React.ReactElement;
  isOverride: boolean;
  placeholder?: string;
  title: string;
}

const Overrideable = ({
  value,
  aiValue,
  onChange,
  renderComponent,
  editComponent,
  isOverride,
  placeholder = 'Enter custom value',
  title,
}: OverrideableProps): React.ReactElement => {
  const handleChangeOverride = () => {
    const newOverrideState = !isOverride;

    if (!newOverrideState) {
      onChange(aiValue, false);
    } else {
      onChange(value, true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, true);
  };

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center mb-2">
          <div className="flex items-center space-x-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', isOverride ? 'bg-purple-500' : 'bg-primary')} />
            <h3 className="text-sm font-semibold text-foreground tracking-tight">{title}</h3>
          </div>

          {isOverride ? (
            <span className="ml-2.5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide font-bold rounded-sm bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
              Custom
            </span>
          ) : (
            <span className="ml-2.5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide font-bold rounded-sm bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50">
              AI
            </span>
          )}
        </div>
      )}

      <div className="flex items-center w-full group relative">
        <div
          className={cn(
            'h-full min-h-[32px] w-[3px] mr-3 rounded-sm transition-colors',
            isOverride ? 'bg-purple-500' : 'bg-primary',
          )}
        />

        <button
          className={cn(
            'h-8 rounded-md text-xs font-medium transition-colors mr-2 cursor-pointer',
            'w-[40px] flex items-center justify-center',
            !isOverride
              ? 'bg-background border border-input text-foreground/90 hover:bg-accent'
              : 'bg-primary/15 text-primary font-semibold hover:bg-primary/25',
            'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          )}
          onClick={handleChangeOverride}
          title={isOverride ? 'Click to use AI suggestion' : 'Click to override with your own value'}
          type="button"
          data-slot="button"
        >
          {isOverride ? <BiEditAlt size={16} /> : <RiSparklingLine size={16} />}
        </button>

        <div
          className={cn(
            'flex-1 rounded-md overflow-hidden relative',
            'border',
            isOverride
              ? 'border-purple-200 bg-purple-50/30 dark:border-purple-800 dark:bg-purple-900/20'
              : 'border-input',
          )}
        >
          {isOverride ? (
            <>
              {editComponent ? (
                <div className="px-2 py-2">{editComponent()}</div>
              ) : (
                <Input
                  value={value || aiValue}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="border-0 shadow-none bg-transparent"
                />
              )}
            </>
          ) : renderComponent ? (
            <div className="px-3 py-2">{renderComponent(value)}</div>
          ) : (
            <div className="px-3 py-2 text-sm">{value}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overrideable;
