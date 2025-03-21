import { Section } from '@/components/layout';
import { CardContent } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Course } from '@/lib/mongo/models/CourseModel';
import { completeLesson } from '@/lib/services/courseServices';
import { QKeys } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { toast } from 'sonner';
import styled from 'styled-components';
import { NoContent, RegenerateLesson } from './comps';
import RenderLesson from '@/components/RenderLesson';
import { TimeBadge } from '@/components/badges';
import { getLessonContent } from '@/lib/services/lessonContentServices';
import Loader from '@/components/Loader';
import { destoyImage } from '@/lib/services/util';

const Div = styled.div``;

interface LessonViewProps {
  course: Course;
  moduleId: string;
  lessonNumber: number;
}

export const LessonView: React.FC<LessonViewProps> = ({ course, moduleId, lessonNumber }) => {
  const [streamMessage, setStreamMessage] = useState('');
  const lesson = course.modules.roadmap.find((module) => module.id === moduleId)?.lessons[lessonNumber - 1];
  const lessonContentId = lesson?.content?.toString();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (isCompleted: boolean) =>
      completeLesson({
        uxId: course.uxId,
        // @ts-ignore
        lessonId: lesson._id,
        isCompleted,
        moduleId,
      }),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, course.uxId] }),
    onError: (error) => toast.error(error.message || 'Something went wrong'),
  });

  const { mutateAsync: generateContent, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      setStreamMessage('Generating lesson');
      destoyImage(lessonContent?.heroImageUrl);

      const response = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uxId: course.uxId,
          moduleId,
          // @ts-ignore
          lessonId: lesson?._id,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate lesson');
      }

      const reader = response.body.getReader();
      let result = null;

      try {
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const data = JSON.parse(line);
              if (data.error) {
                toast.error(data.message || 'Invalid input', { richColors: true });
                return null;
              }
              if (data.message) setStreamMessage(data.message);
              if (data.result) result = data.result;
            } catch (e) {}
          }
        }

        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer);
            if (data.error) {
              toast.error(data.message || 'Invalid input', { richColors: true });
              return null;
            }
            if (data.message) setStreamMessage(data.message);
            if (data.result) result = data.result;
          } catch (e) {}
        }
      } finally {
        reader.releaseLock();
      }

      return result;
    },
    onSuccess: async (data) => {
      console.log('====DATA', data);
      await mutateAsync(false);
      await queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, course.uxId] });
      await queryClient.invalidateQueries({ queryKey: [QKeys.LESSON_CONTENT, lessonContentId] });
    },
    onError: (error) =>
      toast.error(error.message || 'Something went wrong', {
        richColors: true,
      }),
  });

  const { data: lessonContent, isLoading } = useQuery({
    queryFn: () => getLessonContent(lessonContentId),
    queryKey: [QKeys.LESSON_CONTENT, lessonContentId],
  });

  if (!lesson) return null;

  const hasContent = !!lessonContent;

  return (
    <Div>
      {!isLoading ? (
        <>
          <Section
            title={lesson.title}
            description={lesson.description}
            verticalGutter
            isLoading={
              isGenerating
                ? {
                    message: streamMessage,
                  }
                : false
            }
            bottomComponent={
              hasContent && (
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <TimeBadge value={lesson.durationMinutes} label="minutes" />
                    <RegenerateLesson onRegenerate={() => generateContent()} />
                  </div>
                  <div
                    className="items-top flex space-x-2 cursor-pointer mt-2"
                    style={{ cursor: 'pointer !important' }}
                  >
                    <Checkbox
                      label="Lesson Completed"
                      checked={lesson.isCompleted}
                      onCheckedChange={() => mutateAsync(!lesson?.isCompleted)}
                      disabled={isPending}
                    />
                  </div>
                </div>
              )
            }
          >
            {!hasContent && !isLoading && (
              <CardContent>
                <NoContent
                  onGenerateContent={generateContent}
                  isGenerating={isGenerating}
                  canGenerate={
                    lessonNumber === 1 ||
                    !!course.modules.roadmap.find((module) => module.id === moduleId)?.lessons[lessonNumber - 2]
                      ?.content
                  }
                />
              </CardContent>
            )}
          </Section>
          {lessonContent && (
            <>
              <div className="mt-4" />
              <RenderLesson md={lessonContent.md} heroImageUrl={lessonContent.heroImageUrl} />
            </>
          )}
        </>
      ) : (
        <Loader />
      )}
    </Div>
  );
};
