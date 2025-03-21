'use client';
import { H2 } from '@/components/typography';
import { useAuth } from '@/hooks/useAuth';
import { getCourses } from '@/requests/course';
import { QKeys } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { CourseCard } from './comps';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import Loader from '@/components/Loader';

const MyCoursesScreen = () => {
  const { user } = useAuth();
  const [favouritesOnly, setFavouritesOnly] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: [QKeys.COURSES],
    queryFn: () => getCourses(),
  });

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <H2 className="text-3xl font-bold mb-6">My Courses</H2>
        <Checkbox
          id="favourites-only"
          label="Favourites only"
          checked={favouritesOnly}
          onCheckedChange={(checked) => setFavouritesOnly(!!checked)}
        />
      </div>
      {isLoading && <Loader />}
      {courses && (
        <>
          {courses.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter((el) => (favouritesOnly ? el.favourite : true))
                .map((course) => (
                  <CourseCard key={course.uxId} course={course} />
                ))}
            </div>
          ) : (
            <>Empty</>
          )}
        </>
      )}
    </div>
  );
};

export default MyCoursesScreen;
