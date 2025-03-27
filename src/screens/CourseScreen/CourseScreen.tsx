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
import { Menu, BookOpen, BookOpenText, MessageSquare, MessageSquareText } from 'lucide-react';

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 33.33%;
  border-radius: 0;
  background: transparent;
  color: ${(props) => (props.$active ? 'var(--primary)' : 'var(--muted-foreground)')};
  position: relative;

  /* Label text */
  span {
    font-size: 12px;
    margin-top: 4px;
    font-weight: ${(props) => (props.$active ? '600' : '400')};
  }

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
    color: var(--primary);
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

  if (!user) return null;

  return (
    <>
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
            aria-label="Course outline"
            $active={activeMobilePanel === 'menu'}
          >
            <Menu size={20} />
            <span>Outline</span>
          </NavButton>

          <NavButton
            onClick={() => setActiveMobilePanel('content')}
            aria-label="Course content"
            $active={activeMobilePanel === 'content'}
          >
            {activeMobilePanel === 'content' ? <BookOpenText size={20} /> : <BookOpen size={20} />}
            <span>Content</span>
          </NavButton>

          <NavButton
            onClick={() => setActiveMobilePanel('chat')}
            aria-label="Chat"
            $active={activeMobilePanel === 'chat'}
          >
            {activeMobilePanel === 'chat' ? <MessageSquareText size={20} /> : <MessageSquare size={20} />}
            <span>Chat</span>
          </NavButton>
        </MobileNavBar>
      )}
    </>
  );
};

export default CourseScreen;
