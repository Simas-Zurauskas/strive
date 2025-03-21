import React from 'react';
import styled from 'styled-components';

const Div = styled.div`
  display: inline-block;
`;

interface TimeBadgeProps {
  value: number;
  label?: string;
}

export const TimeBadge: React.FC<TimeBadgeProps> = ({ value, label = 'hours' }) => {
  return (
    <Div>
      <div className="flex items-center bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-md">
        <svg
          className="w-4 h-4 mr-1.5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-sm font-medium">
          {value} {label}
        </span>
      </div>
    </Div>
  );
};
