import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormValues } from '../types';
import { MdOutlineTipsAndUpdates } from 'react-icons/md';
import { H3, P } from '@/components/typography';
import { saveCourse } from '@/lib/services/courseServices';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import Overrideable from '@/components/Overrideable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DifficultyLevel } from '@/lib/mongo/models/CourseModel';
import { Section } from '@/components/layout';
import { ExternalLinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { genUxId } from '@/lib/utils';
import { destroyModule } from '@/lib/services/util';
import { useQueryClient } from '@tanstack/react-query';
import { getChatKey } from '@/screens/CourseScreen/util';
import NoCredits from '@/components/NoCredits';
import { useCredits } from '@/hooks/useCredits';

interface InitialFormProps {
  streamMessage: string;
}

export const InitialForm: React.FC<InitialFormProps> = ({ streamMessage }) => {
  const { data: session } = useSession();
  const { values, setFieldValue, isSubmitting, dirty, resetForm, isValid, errors } = useFormikContext<FormValues>();
  const router = useRouter();
  const [overrideableValuesChanged, setOverrideableValuesChanged] = useState(false);
  const { credits } = useCredits();

  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      values.details?.courseTitle?.override !== undefined ||
      values.details?.completionHours?.override !== undefined ||
      values.details?.difficultyLevel?.override !== undefined ||
      values.initial.learningGoal ||
      values.initial.currentKnowledge
    ) {
      setOverrideableValuesChanged(true);
    }
  }, [
    values.details?.courseTitle?.override,
    values.details?.completionHours?.override,
    values.details?.difficultyLevel?.override,
    values.initial.learningGoal,
    values.initial.currentKnowledge,
  ]);

  useEffect(() => {
    if (isSubmitting) {
      setOverrideableValuesChanged(false);
    }
  }, [isSubmitting]);

  const handleSaveCourse = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (values._id) {
      queryClient.invalidateQueries({ queryKey: getChatKey({ uxId: values._id.toString() }) });

      for (const module of values.modules.roadmap) {
        await destroyModule({ courseId: values._id.toString(), moduleId: module.id });
      }
    }

    const uxId = values.uxId || genUxId();

    const updatedValues = {
      ...values,
      uxId,
    };

    saveCourse({
      uxId,
      user: session!.user.id,
      course: {
        chat: { summary: '', messages: [] },
        initial: {
          learningGoal: updatedValues.initial.learningGoal,
          currentKnowledge: updatedValues.initial.currentKnowledge,
        },
        details: {
          courseDescription: updatedValues.details!.courseDescription,
          tags: updatedValues.details!.tags,

          courseTitle: {
            value: updatedValues.details!.courseTitle.value,
            override: updatedValues.details!.courseTitle.override,
          },
          completionHours: {
            value: updatedValues.details!.completionHours.value,
            override: updatedValues.details!.completionHours.override,
          },
          difficultyLevel: {
            value: updatedValues.details!.difficultyLevel.value,
            override: updatedValues.details!.difficultyLevel.override,
          },
        },
        modules: {
          roadmap: updatedValues.modules.roadmap.map((el) => ({
            ...el,
            lessons: [],
            chat: { summary: '', messages: [] },
          })),
          edges: updatedValues.modules.edges,
        },
      },
    })
      .then(() => {
        toast.success('Course saved successfully', { richColors: true });
        setFieldValue('uxId', uxId);
        resetForm({ values: updatedValues });
        setOverrideableValuesChanged(false);
      })
      .catch(({ message }) => toast.error(message || 'Something went wrong', { richColors: true }));
  };

  return (
    <Section
      title="Your Learning Objective"
      description="Let's start by defining your learning goal and existing knowledge."
      isLoading={isSubmitting ? { message: streamMessage } : false}
    >
      <CardContent className="flex flex-col gap-4 mt-4 mb-4">
        <Textarea
          placeholder="What do you want to achieve?*"
          value={values.initial.learningGoal}
          onChange={(e) => setFieldValue('initial.learningGoal', e.target.value)}
          required
          error={errors.initial?.learningGoal}
        />
        <Textarea
          placeholder="What do you already know? (Optional)"
          value={values.initial.currentKnowledge}
          onChange={(e) => setFieldValue('initial.currentKnowledge', e.target.value)}
        />

        {!!values.details.courseDescription && (
          <>
            <div className="mt-2 mb-4 border-t pt-4">
              <H3 className="text-xl font-bold mb-2">Recommended Learning Plan</H3>
              <CardDescription className="mb-4">
                Review and customize the recommended learning path below.
              </CardDescription>

              <Overrideable
                value={values.details.courseTitle.override || values.details.courseTitle.value}
                aiValue={values.details.courseTitle.value}
                isOverride={!!values.details.courseTitle.override}
                renderComponent={(value) => <h3 className="text-lg font-semibold text-primary">{value}</h3>}
                title="Course Title"
                error={errors.details?.courseTitle?.override}
                onChange={(value, isOverride) => {
                  if (isOverride) {
                    setFieldValue('details.courseTitle.override', value);
                  } else {
                    setFieldValue('details.courseTitle.override', undefined);
                  }
                }}
              />

              <div className="mt-4" />

              <Overrideable
                title="Hours to complete the course"
                value={String(values.details.completionHours.override || values.details.completionHours.value)}
                aiValue={String(values.details.completionHours.value)}
                isOverride={!!values.details.completionHours.override}
                error={errors.details?.completionHours?.override}
                onChange={(value, isOverride) => {
                  if (isOverride) {
                    setFieldValue('details.completionHours.override', +value);
                  } else {
                    setFieldValue('details.completionHours.override', undefined);
                  }
                }}
              />
              <div className="mt-4" />

              <Overrideable
                title="Difficulty Level"
                value={String(values.details.difficultyLevel.override || values.details.difficultyLevel.value)}
                aiValue={String(values.details.difficultyLevel.value)}
                isOverride={!!values.details.difficultyLevel.override}
                editComponent={() => (
                  <Select
                    value={values.details.difficultyLevel.override || values.details.difficultyLevel.value}
                    onValueChange={(value) => setFieldValue('details.difficultyLevel.override', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DifficultyLevel.Foundation}>Foundation</SelectItem>
                      <SelectItem value={DifficultyLevel.Beginner}>Beginner</SelectItem>
                      <SelectItem value={DifficultyLevel.Intermediate}>Intermediate</SelectItem>
                      <SelectItem value={DifficultyLevel.Advanced}>Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                renderComponent={(value) => (
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-primary/15 text-primary font-medium text-xs border border-primary/20 shadow-sm transition-all hover:bg-primary/20">
                    <span>{value}</span>
                  </div>
                )}
                onChange={(value, isOverride) => {
                  if (isOverride) {
                    setFieldValue('details.difficultyLevel.override', value);
                  } else {
                    setFieldValue('details.difficultyLevel.override', undefined);
                  }
                }}
              />

              <div className="bg-card rounded-lg border shadow-sm overflow-hidden mt-4">
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <MdOutlineTipsAndUpdates className="text-primary text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium mb-1">Course Overview</h4>
                      <P className="text-muted-foreground">{values.details.courseDescription}</P>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <P className="text-sm text-muted-foreground">
                      This is a preliminary recommendation. Continue to see the detailed roadmap and learning modules.
                    </P>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {!credits && <NoCredits />}
        <div className="flex gap-3 items-center justify-between">
          {credits ? (
            <Button className="flex-1 sm:flex-none" type="submit" disabled={isSubmitting || !isValid}>
              {values.details.courseDescription ? 'Regenerate Roadmap' : 'Generate Learning Roadmap'} (Cr. 1)
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-3 items-center justify-between">
            {values.details.courseDescription && (
              <Button
                className="flex-1 sm:flex-none"
                variant="default"
                disabled={isSubmitting || !dirty || overrideableValuesChanged || !isValid}
                onClick={handleSaveCourse}
              >
                {values.uxId ? 'Update Course' : 'Save Course'}
              </Button>
            )}
            {values.uxId && (
              <Button
                className="flex-1 sm:flex-none"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/courses/${values.uxId}`);
                }}
              >
                <ExternalLinkIcon className="mr-2 h-4 w-4" />
                View Course
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Section>
  );
};
