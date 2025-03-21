import { Section } from '@/components/layout';
import { P } from '@/components/typography';
import { CardContent } from '@/components/ui';
import { Course } from '@/lib/mongo/models/CourseModel';
import { NoContent, LessonsView, RegenerateModule } from './comps';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TimeBadge } from '@/components/badges';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QKeys } from '@/types';
import { View } from '@/screens/CourseScreen/types';
import { destroyModule } from '@/lib/services/util';

const Div = styled.div``;

interface ModuleViewProps {
  course: Course;
  moduleId: string;
  setView: (view: View) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({ course, moduleId, setView }) => {
  const module = course.modules.roadmap.find((node) => node.id === moduleId);
  const [streamMessage, setStreamMessage] = useState<string>('');

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      setStreamMessage('Generating module');
      await destroyModule({ courseId: course._id.toString(), moduleId });

      const response = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: { uxId: course.uxId, moduleId } }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to generate module');
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
              if (data.message) setStreamMessage(data.message);
              if (data.result) result = data.result;
            } catch (e) {}
          }
        }

        if (buffer.trim()) {
          try {
            const data = JSON.parse(buffer);
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
      // console.log('data', data);
      // console.log(data?.reduce((acc, lesson) => acc + lesson.durationMinutes, 0) / 60);

      await queryClient.invalidateQueries({ queryKey: [QKeys.COURSE, course.uxId] });
    },
  });

  const handleOpenLesson = (lessonOrder: number) => {
    setView({
      type: 'lesson',
      moduleId,
      lessonNumber: lessonOrder,
      // @ts-ignore
      lessonId: module?.lessons[lessonOrder]._id.toString(),
    });
  };

  if (!module) return null;

  const hasLessons = module.lessons && module.lessons.length > 0;

  return (
    <Div>
      <Section
        title={module.title}
        description={module.description}
        verticalGutter
        isLoading={isPending ? { message: streamMessage } : false}
      >
        <CardContent>
          <P>{module.longDescription}</P>

          <div className="flex flex-wrap gap-4 mt-6">
            <TimeBadge value={module.estimatedHours} />
            <div
              style={{ height: '32px' }}
              className={`flex items-center text-sm font-medium px-3 py-0 rounded-md ${
                module.isRequired
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100'
              }`}
            >
              {module.isRequired ? 'Required' : 'Optional'}
            </div>

            {hasLessons && (
              <div className="flex items-center gap-2 ml-auto">
                <RegenerateModule onRegenerate={mutateAsync} />
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            {hasLessons ? (
              <LessonsView lessons={module.lessons} onOpenLesson={handleOpenLesson} />
            ) : (
              <NoContent onGenerateContent={mutateAsync} isGenerating={isPending} />
            )}
          </div>
        </CardContent>
      </Section>
    </Div>
  );
};
