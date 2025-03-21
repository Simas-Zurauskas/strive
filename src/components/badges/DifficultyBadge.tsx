import React from 'react';
import styled from 'styled-components';

const Div = styled.div``;

interface DifficultyBadgeProps {
  difficultyLevel: string;
}

const getBadgeColor = (difficulty: string) => {
  const level = difficulty.toLowerCase();
  if (level.includes('foundation')) return 'bg-blue-100 text-blue-800';
  if (level.includes('beginner')) return 'bg-green-100 text-green-800';
  if (level.includes('intermediate')) return 'bg-yellow-100 text-yellow-800';
  if (level.includes('advanced')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficultyLevel }) => {
  return (
    <Div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(difficultyLevel)}`}>
        {difficultyLevel}
      </span>
    </Div>
  );
};
