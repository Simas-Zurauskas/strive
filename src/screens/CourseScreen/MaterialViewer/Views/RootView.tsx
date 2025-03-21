import FlowEdit from '@/components/Flow/FlowEdit';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import React from 'react';
import styled from 'styled-components';
import { Course } from '@/lib/mongo/models/CourseModel';
import { Section } from '@/components/layout';
import { DifficultyBadge, TimeBadge } from '@/components/badges';
import { View } from '../../types';

const Div = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted-foreground);
`;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

interface RootViewProps {
  course: Course;
  setView: (view: View) => void;
}

export const RootView: React.FC<RootViewProps> = ({ course, setView }) => {
  const getEffectiveValue = <T,>(field: { value: T; override?: T }) => {
    return field.override !== undefined ? field.override : field.value;
  };

  const courseTitle = getEffectiveValue(course.details.courseTitle);
  const completionHours = getEffectiveValue(course.details.completionHours);
  const difficultyLevel = getEffectiveValue(course.details.difficultyLevel);

  return (
    <Div>
      <Section title={courseTitle} description={course.details.courseDescription} verticalGutter isLoading={false}>
        <CardContent>
          <DetailGrid>
            <DetailItem>
              <DetailLabel>Difficulty Level</DetailLabel>
              <div>
                <DifficultyBadge difficultyLevel={difficultyLevel} />
              </div>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Estimated Completion Time</DetailLabel>
              <div>
                <TimeBadge value={completionHours} />
              </div>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Learning Goal</DetailLabel>
              <DetailValue>{course.initial.learningGoal}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Current Knowledge</DetailLabel>
              <DetailValue>{course.initial.currentKnowledge || 'Not specified'}</DetailValue>
            </DetailItem>
          </DetailGrid>

          {course.details.tags && course.details.tags.length > 0 && (
            <DetailItem style={{ marginTop: '1.5rem' }}>
              <DetailLabel>Tags</DetailLabel>
              <TagsContainer>
                {course.details.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </TagsContainer>
            </DetailItem>
          )}
        </CardContent>
      </Section>
      <Section title="Modules" description="Modules are the main units of content in the course.">
        <FlowEdit
          edges={course.modules.edges}
          initialNodes={course.modules.roadmap}
          showLessonsProgress
          onNodeClick={(node) => {
            setView({
              type: 'module',
              moduleId: node.id,
            });
          }}
        />
      </Section>
    </Div>
  );
};
