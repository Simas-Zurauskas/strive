import { Course } from '@/lib/mongo/models/CourseModel';
import styled from 'styled-components';
import { Edit, ExpandableCourseTree } from './comps';
import { View } from '../types';
import { Head } from './comps/Head';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Div = styled(motion.div)<{ $isVisible?: boolean }>`
  min-width: 40px;
  max-width: 420px;
  top: 56px;
  position: relative;
  height: calc(100vh - 40px);

  @media (max-width: 768px) {
    display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
    width: 100% !important;
    max-width: 100%;
    position: absolute;
    z-index: 20;
    left: 0;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px 10px;
    overflow-y: auto;
    width: 100%;
    height: 100%;

    &__del {
      margin-top: auto;
    }

    @media (max-width: 768px) {
      padding-bottom: 72px; /* Extra padding at bottom for mobile navigation bar */
    }
  }

  h4 {
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
  }

  .toggle-button {
    position: absolute;
    top: 10px;
    right: -12px;
    z-index: 10;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--background);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &::before {
      content: '';
      position: absolute;
      top: -12px;
      left: -12px;
      right: -12px;
      bottom: -12px;
      z-index: -1;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const ContentContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding-top: 0;
  padding-bottom: 24px;
`;

interface CourseDetailsSectionProps {
  course: Course;
  setView: (view: View) => void;
  view: View;
  isVisible?: boolean;
}

const CourseDetailsSection: React.FC<CourseDetailsSectionProps> = ({ course, setView, view, isVisible = true }) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const animationComplete = useRef(true);

  const handleToggleCollapse = () => {
    // Don't allow double-click during animation
    if (!animationComplete.current) return;

    animationComplete.current = false;

    if (isCollapsed) {
      // Expanding: first expand width, then show content
      setIsCollapsed(false);
      setTimeout(() => {
        setContentVisible(true);
        animationComplete.current = true;
      }, 200);
    } else {
      // Collapsing: first hide content, then collapse width
      setContentVisible(false);
      setTimeout(() => {
        setIsCollapsed(true);
        animationComplete.current = true;
      }, 100);
    }
  };

  return (
    <Div
      className="bg-background border-r flex flex-col"
      animate={{
        width: isCollapsed ? '40px' : '420px',
      }}
      initial={false}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.15,
      }}
      $isVisible={isVisible}
    >
      <button
        className="toggle-button"
        onClick={handleToggleCollapse}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <ContentContainer animate={{ opacity: contentVisible ? 1 : 0 }} transition={{ duration: 0.1 }}>
        {contentVisible && (
          <div className="mb-4 content">
            <Head
              course={course}
              isOverviewActive={view.type === 'root'}
              onBackToRoot={() => {
                setView({ type: 'root' });
                setActiveModuleId(null);
              }}
            />
            <ExpandableCourseTree
              course={course}
              setView={setView}
              activeModuleId={activeModuleId}
              setActiveModuleId={setActiveModuleId}
              activeLessonNumber={view.type === 'lesson' ? view.lessonNumber : null}
            />
            <div className="content__del">
              <Edit uxId={course.uxId} />
            </div>
          </div>
        )}
      </ContentContainer>
    </Div>
  );
};

export default CourseDetailsSection;
