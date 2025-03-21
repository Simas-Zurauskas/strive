import { ChevronRight } from 'lucide-react';
import { H4 } from '@/components/typography';
import { Course } from '@/lib/mongo/models/CourseModel';
import { Compass } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';
import { QKeys } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import FavouriteStar from '@/components/FavouriteStar';

interface CourseHeaderProps {
  isOverview: boolean;
}

const CourseHeader = styled.div<CourseHeaderProps>`
  position: relative;
  padding: 12px 16px;
  margin-bottom: 20px;
  background: var(--background);
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--primary-foreground));
    border-radius: 0 0 10px 10px;
    opacity: ${({ isOverview }) => (isOverview ? '1' : '0.5')};
  }

  &:hover:after {
    opacity: 1;
  }
`;

const CourseTitleWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ContextualContent = styled.div`
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: space-between;
  margin-top: 10px;
  width: 100%;
`;

const CourseSubtitle = styled.div`
  font-size: 13px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

const ActionButton = styled.button`
  display: inline-flex;
  margin-right: auto;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: var(--accent);
  border: none;
  cursor: pointer;
  color: var(--accent-foreground);

  &:hover {
    background: var(--accent-foreground);
    color: var(--accent);
  }

  &.primary {
    background: var(--primary);
    color: var(--primary-foreground);

    &:hover {
      background: var(--primary-hover, var(--primary));
    }
  }
`;

interface HeadProps {
  course: Course;
  isOverviewActive: boolean;
  onBackToRoot: () => void;
}

export const Head: React.FC<HeadProps> = ({ isOverviewActive, course, onBackToRoot }) => {
  const queryClient = useQueryClient();

  const isFavourite = course.favourite;
  return (
    <CourseHeader isOverview={isOverviewActive}>
      <CourseTitleWrapper>
        <H4 className={isOverviewActive ? 'text-primary' : ''}>
          {course.details.courseTitle.override || course.details.courseTitle.value}
        </H4>
      </CourseTitleWrapper>

      <ContextualContent>
        {isOverviewActive ? (
          <CourseSubtitle>
            <Compass size={14} />
            <span>Course Overview</span>
          </CourseSubtitle>
        ) : (
          <ActionButton onClick={onBackToRoot}>
            <ChevronRight size={14} />
            <span>Back to Overview</span>
          </ActionButton>
        )}
        <FavouriteStar isFavourite={isFavourite} uxId={course.uxId} queryKey={[QKeys.COURSE, course.uxId]} />
      </ContextualContent>
    </CourseHeader>
  );
};
