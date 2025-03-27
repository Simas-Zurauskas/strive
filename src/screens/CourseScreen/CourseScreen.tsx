'use client';
import { useAuth } from '@/hooks/useAuth';
import { getCourse } from '@/lib/services/courseServices';
import { QKeys } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import CourseDetailsSection from './CourseDetailsSection';
import Chat from './Chat';
import MaterialViewer from './MaterialViewer/MaterialViewer';
import { View } from './types';
import styled from 'styled-components';
import { Menu, X, MessageSquare, ChevronLeft } from 'lucide-react';

const Div = styled.div`
  display: flex;
  overflow: hidden;
  height: 100vh;
  top: -56px;
  position: relative;

  @media (max-width: 768px) {
    padding-bottom: 56px; /* Add space for mobile navigation bar */
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 72px; /* Extra padding at bottom for mobile navigation */
  }
`;

const NavButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;
  background: ${(props) => (props.$active ? 'var(--primary-foreground)' : 'transparent')};
  color: ${(props) => (props.$active ? 'var(--primary)' : 'var(--foreground)')};
  position: relative;

  /* Use pseudo-element for larger touch target without affecting layout */
  @media (max-width: 768px) {
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
      z-index: -1;
    }
  }

  &:hover {
    background: var(--accent);
  }
`;

const HeaderBackButton = styled(NavButton)`
  position: relative;

  /* Extend touch area without affecting layout */
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: -16px; /* Extra space on left side */
    right: -8px;
    bottom: -8px;
    z-index: -1;
  }
`;

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  height: 48px;
  background-color: var(--background);
  border-bottom: 1px solid var(--border);
  z-index: 40;
  padding: 0 16px;
  align-items: center;

  h1 {
    font-size: 16px;
    font-weight: 600;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileNavBar = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--background);
  border-top: 1px solid var(--border);
  z-index: 50;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const CourseScreen = () => {
  const [view, setView] = useState<View>({ type: 'root' });
  const { user } = useAuth();
  const { uxId } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeMobilePanel, setActiveMobilePanel] = useState<'content' | 'menu' | 'chat'>('content');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [view]);

  useEffect(() => {
    // Reset to main content view when changing course or view
    setActiveMobilePanel('content');
  }, [uxId, view]);

  const {
    data: course,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QKeys.COURSE, uxId],
    queryFn: () => getCourse(uxId as string),
  });

  // Get the title to display in the mobile header
  const getMobileTitle = () => {
    if (!course) return 'Loading...';

    if (view.type === 'root') {
      return course.details.courseTitle.value || course.details.courseTitle.override || 'Course';
    } else if (view.type === 'module') {
      const module = course.modules.roadmap.find((m) => m.id === view.moduleId);
      return module ? module.title : course.details.courseTitle.value || 'Course';
    } else if (view.type === 'lesson') {
      const module = course.modules.roadmap.find((m) => m.id === view.moduleId);
      if (!module) return course.details.courseTitle.value || 'Course';

      // Find lesson by order number instead of id
      const lesson = module.lessons.find((l) => l.order === view.lessonNumber);
      return lesson ? lesson.title : module.title;
    }

    return course.details.courseTitle.value || 'Course';
  };

  if (!user) return null;

  return (
    <>
      {isMobile && (
        <MobileHeader>
          {activeMobilePanel !== 'content' && (
            <HeaderBackButton onClick={() => setActiveMobilePanel('content')}>
              <ChevronLeft size={20} />
            </HeaderBackButton>
          )}
          <h1>{getMobileTitle()}</h1>
          <div style={{ width: 28 }}></div> {/* Spacer for alignment */}
        </MobileHeader>
      )}

      <Div>
        {course ? (
          <>
            <CourseDetailsSection
              course={course}
              setView={setView}
              view={view}
              isVisible={!isMobile || activeMobilePanel === 'menu'}
            />
            <ContentContainer
              ref={contentRef}
              style={{
                display: !isMobile || activeMobilePanel === 'content' ? 'block' : 'none',
                paddingTop: isMobile ? '64px' : '24px', // Extra top padding on mobile for the header
              }}
            >
              <MaterialViewer course={course} view={view} setView={setView} />
            </ContentContainer>
            <Chat
              // @ts-ignore
              cPointer={{ uxId: uxId as string, module: { moduleId: view.moduleId, lessonId: view.lessonId } }}
              isVisible={!isMobile || activeMobilePanel === 'chat'}
            />
          </>
        ) : (
          <>
            {isLoading && <div>Loading</div>}
            {error && <div>Error</div>}
          </>
        )}
      </Div>

      {isMobile && (
        <MobileNavBar>
          <NavButton
            onClick={() => setActiveMobilePanel('menu')}
            aria-label="Course menu"
            $active={activeMobilePanel === 'menu'}
          >
            {activeMobilePanel === 'menu' ? <X size={24} /> : <Menu size={24} />}
          </NavButton>

          <NavButton
            onClick={() => setActiveMobilePanel('content')}
            aria-label="Course content"
            $active={activeMobilePanel === 'content'}
          >
            <span>Content</span>
          </NavButton>

          <NavButton
            onClick={() => setActiveMobilePanel('chat')}
            aria-label="Chat"
            $active={activeMobilePanel === 'chat'}
          >
            {activeMobilePanel === 'chat' ? <X size={24} /> : <MessageSquare size={24} />}
          </NavButton>
        </MobileNavBar>
      )}
    </>
  );
};

export default CourseScreen;
