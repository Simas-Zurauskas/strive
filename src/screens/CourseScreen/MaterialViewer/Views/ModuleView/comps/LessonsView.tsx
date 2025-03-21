import React from 'react';
import styled from 'styled-components';
import { P } from '@/components/typography';
import { sortBy } from 'lodash';
import { Course } from '@/lib/mongo/models/CourseModel';

const LessonsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const LessonCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--card);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--primary);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    background: ${(props) => (props.className?.includes('completed') ? '#10b981' : 'var(--primary)')};
    opacity: ${(props) => (props.className?.includes('completed') ? '1' : '0.5')};
  }
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Description = styled(P)`
  line-height: 1.4;
  margin-top: 0;
`;

const DurationBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--slate-100);
  color: var(--slate-700);

  @media (prefers-color-scheme: dark) {
    background: var(--slate-800);
    color: var(--slate-300);
  }
`;

interface LessonsViewProps {
  lessons: Course['modules']['roadmap'][0]['lessons'];
  onOpenLesson: (lessonOrder: number) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({ lessons, onOpenLesson }) => {
  return (
    <LessonsList>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">Lessons</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These lessons are customized to your learning path. Follow them in sequence to build your skills
          progressively.
        </p>
      </div>

      {sortBy(lessons, ['order']).map((lesson) => (
        <LessonCard
          key={lesson.order}
          className={`${lesson.isCompleted ? 'completed' : ''}`}
          onClick={() => onOpenLesson(lesson.order)}
        >
          <DurationBadge>{lesson.durationMinutes} min</DurationBadge>

          <div className="pl-1">
            <Title className="mb-1">{lesson.title}</Title>
            <Description className="text-xs text-muted-foreground">{lesson.description}</Description>
          </div>
        </LessonCard>
      ))}
    </LessonsList>
  );
};
