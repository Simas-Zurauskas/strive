import { useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, Circle, Check, AlertTriangle } from 'lucide-react';
import { Course } from '@/lib/mongo/models/CourseModel';
import ExpandableItem from './ExpandableItem';
import { View } from '../../types';
import { sortBy } from 'lodash';

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  font-size: 14px;
  gap: 8px;
`;

const LessonRow = styled.div`
  position: relative;
  padding: 0;
  background-color: var(--background);
  display: flex;
  align-items: center;
  min-height: 48px;
  margin: 1px;
  border-radius: 0.25rem;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  width: 48px;
  height: 48px;
`;

const CompletionIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.completed {
    background-color: #10b981;
    color: white;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  }

  &:not(.completed) {
    border: 2px solid var(--muted-foreground);
    color: var(--muted-foreground);
  }
`;

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 16px 0 8px;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  height: 100%;
  overflow: hidden;

  &:hover {
    background-color: var(--accent);
  }
`;

const ItemLabel = styled.div`
  flex: 1;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 1px);
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: var(--muted-foreground);
  margin-left: 8px;
  font-weight: 500;

  &.completed {
    color: #10b981;
    font-weight: 900;
  }
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const InfoMessage = styled.div`
  padding: 12px 16px 12px 20px;
  color: var(--muted-foreground);
  font-style: italic;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const WarningIcon = styled.div`
  color: #f59e0b; /* Amber/orange color */
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ExpandableCourseTreeProps {
  course: Course;
  setView: (view: View) => void;
  activeModuleId: string | null;
  setActiveModuleId: (moduleId: string | null) => void;
  activeLessonNumber: number | null;
}

const ExpandableCourseTree: React.FC<ExpandableCourseTreeProps> = ({
  course,
  setView,
  activeModuleId,
  activeLessonNumber,
  setActiveModuleId,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set([]));

  const toggleExpand = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleModuleClick = (moduleId: string) => {
    setView({ type: 'module', moduleId });
    setActiveModuleId(moduleId);
  };

  const handleLessonClick = (moduleId: string, lessonNumber: number, id: string) => {
    // @ts-ignore
    setView({ type: 'lesson', moduleId, lessonNumber, lessonId: id });
    setActiveModuleId(moduleId);
  };

  return (
    <TreeContainer>
      {course.modules.roadmap.map((module) => {
        const isGenerated = module.lessons && module.lessons.length > 0;
        const completedLength = module.lessons.filter((lesson) => lesson.isCompleted).length;
        const totalLength = module.lessons.length;
        const progress = Math.round((completedLength / totalLength) * 100);

        return (
          <ExpandableItem
            key={module.id}
            itemId={module.id}
            isExpanded={expandedItems.has(module.id)}
            isActive={module.id === activeModuleId}
            onToggle={toggleExpand}
            onClick={() => handleModuleClick(module.id)}
            header={
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 36px' }}>
                <ItemLabel>
                  <b>{module.title}</b>
                </ItemLabel>
                <ProgressWrapper>
                  <ProgressText className={progress === 100 ? 'completed' : ''}>
                    {isGenerated ? <>{progress}%</> : <i>N/A</i>}
                  </ProgressText>
                </ProgressWrapper>
              </div>
            }
          >
            {isGenerated ? (
              sortBy(module.lessons, ['order']).map((lesson) => {
                const isLessonSelected = lesson.order === activeLessonNumber && module.id === activeModuleId;
                return (
                  <LessonRow key={`${module.id}-${lesson.order}`}>
                    <StatusIcon>
                      <CompletionIndicator className={lesson.isCompleted ? 'completed' : ''}>
                        {lesson.isCompleted ? <Check className="size-3" strokeWidth={3} /> : null}
                      </CompletionIndicator>
                    </StatusIcon>
                    {/* @ts-ignore */}
                    <ItemContent onClick={() => handleLessonClick(module.id, lesson.order, lesson._id.toString())}>
                      <ItemLabel
                        style={{
                          fontWeight: isLessonSelected ? 'bold' : 'normal',
                        }}
                      >
                        {lesson.title}
                      </ItemLabel>
                    </ItemContent>
                  </LessonRow>
                );
              })
            ) : (
              <InfoMessage>
                <WarningIcon>
                  <AlertTriangle className="size-4" />
                </WarningIcon>
                Module is not generated yet
              </InfoMessage>
            )}
          </ExpandableItem>
        );
      })}
    </TreeContainer>
  );
};

export default ExpandableCourseTree;
