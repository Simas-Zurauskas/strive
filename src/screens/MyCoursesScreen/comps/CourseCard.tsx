import React from 'react';
import { DifficultyBadge } from '@/components/badges';
import { Course } from '@/lib/mongo/models/CourseModel';
import { QKeys } from '@/types';
import Link from 'next/link';
import FavouriteStar from '@/components/FavouriteStar';

interface CourseCardProps {
  course: Course;
  initialFavorite?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const displayTitle = course.details.courseTitle.override || course.details.courseTitle.value;
  const difficultyLevel = course.details.difficultyLevel.override || course.details.difficultyLevel.value;
  const completionHours = course.details.completionHours.override || course.details.completionHours.value;
  const tags = course.details.tags || [];
  const tagStyle = 'bg-secondary text-secondary-foreground dark:bg-secondary/80 dark:text-secondary-foreground/90';

  const requiredModules = course.modules.roadmap.filter((el) => el.isRequired);
  const totalModules = requiredModules.length;

  const completedModules = course.modules.roadmap.filter(
    (el) => el.lessons.length > 0 && el.lessons.every((lesson) => lesson.isCompleted),
  ).length;

  const completionPercentage = (completedModules / totalModules) * 100;

  const isCompleted = completionPercentage === 100;
  const isFavorite = course.favourite;

  return (
    <Link href={`/courses/${course.uxId}`} className="block h-full">
      <div className="h-full bg-card text-card-foreground dark:bg-card/95 dark:border-border/30 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/50 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.03] dark:hover:border-primary/70 hover:shadow-primary/5 dark:hover:shadow-primary/20 hover:-translate-y-1 hover:scale-[1.01] flex flex-col overflow-hidden relative group">
        {/* Completion Badge (when completed) */}
        {isCompleted && (
          <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground dark:bg-primary/90 dark:text-primary-foreground/90 rounded-full p-1 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Card Header with Title and Difficulty Badge */}
        <div className="p-6 pb-4 border-b border-border/50 dark:border-border/30">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{displayTitle}</h3>
            <div className="flex flex-col items-end gap-2">
              <FavouriteStar isFavourite={isFavorite} uxId={course.uxId} queryKey={[QKeys.COURSES]} />
              <DifficultyBadge difficultyLevel={difficultyLevel} />
            </div>
          </div>
        </div>

        {/* Card Content with Description */}
        <div className="p-6 pt-5 flex-grow flex flex-col">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground/90 line-clamp-3 mb-4">
            {course.details.courseDescription}
          </p>

          {/* Tags Section */}
          {tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-medium ${tagStyle}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Module Completion Progress Bar - Always visible */}
          <div className="mt-auto pt-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium flex items-center">
                {isCompleted ? (
                  <span className="text-primary dark:text-primary/90 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </span>
                ) : (
                  <span className="text-primary dark:text-primary/90">Progress</span>
                )}
              </span>
              <span className="text-sm font-medium">
                {completedModules}/{totalModules} modules
              </span>
            </div>
            <div className="w-full bg-muted dark:bg-muted/20 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-primary dark:bg-primary/90' : 'bg-primary/70 dark:bg-primary/60'
                }`}
                style={{ width: `${completionPercentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card Footer with Metadata */}
        <div className="px-6 py-3 bg-muted/10 dark:bg-muted/5 border-t border-border/50 dark:border-border/30 flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {completionHours} hours
          </div>
          <span className="text-xs text-muted-foreground dark:text-muted-foreground/70">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};
