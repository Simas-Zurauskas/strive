import { FormValues } from '@/screens/CourseEditScreen/types';
import { client } from '../client';
import { ApiResponse, GenCourseResponse } from '../types';
import { Course } from '@/lib/mongo/models/CourseModel';

type GenerateCourse = (params: FormValues) => Promise<ApiResponse<GenCourseResponse>>;

export const generateCourse: GenerateCourse = (params) => {
  return client({
    url: `/course`,
    method: 'POST',
    data: params,
  }).then((res) => res.data);
};

// ----------------------------------------------------------------------------------------
type GetCourses = () => Promise<ApiResponse<Course[]>>;

export const getCourses: GetCourses = () => {
  return client({
    url: `/course`,
    method: 'GET',
  }).then((res) => res.data);
};

// ----------------------------------------------------------------------------------------
type GetCourse = (uxId: string) => Promise<ApiResponse<Course>>;

export const getCourse: GetCourse = (uxId) => {
  return client({
    url: `/course/${uxId}`,
    method: 'GET',
  }).then((res) => res.data);
};
