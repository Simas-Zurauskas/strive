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

const Div = styled.div`
  display: flex;
  overflow: hidden;
  height: 100vh;
  top: -56px;
  position: relative;
`;

const CourseScreen = () => {
  const [view, setView] = useState<View>({ type: 'root' });
  const { user } = useAuth();
  const { uxId } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [view]);

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
    <Div>
      {course ? (
        <>
          <CourseDetailsSection course={course} setView={setView} view={view} />
          <div ref={contentRef} className="flex-1 p-6" style={{ overflowY: 'auto' }}>
            <MaterialViewer course={course} view={view} setView={setView} />
          </div>
          <Chat
            view={view}
            course={course}
            // @ts-ignore
            cPointer={{ uxId: uxId as string, module: { moduleId: view.moduleId, lessonId: view.lessonId } }}
          />
        </>
      ) : (
        <>
          {isLoading && <div>Loading</div>}
          {error && <div>Error</div>}
        </>
      )}
    </Div>
  );
};

export default CourseScreen;
