'use server';
import cloudinary from '../croudinary';
import { extractCloudinaryPublicIdFromUrl } from '../utils';
import LessonContentModel from '../mongo/models/LessonContent';
import CourseModel from '../mongo/models/CourseModel';

export const destroyCourse = async (courseId: string) => {
  const lessonContents = await LessonContentModel.find({ course: courseId });

  for (const content of lessonContents) {
    await destoyImage(content.heroImageUrl);
    await LessonContentModel.findByIdAndDelete(content._id);
  }

  await CourseModel.findByIdAndDelete(courseId);
};

type DestroyModule = (params: { courseId: string; moduleId: string }) => Promise<void>;

export const destroyModule: DestroyModule = async ({ courseId, moduleId }) => {
  const course = await CourseModel.findById(courseId);
  if (!course) throw new Error('Course not found');
  const module = course.modules.roadmap.find((el) => el.id.toString() === moduleId);
  if (!module) throw new Error('Module not found');

  for (const lesson of module.lessons) {
    const lessonContent = await LessonContentModel.findById(lesson.content);
    if (lessonContent) {
      await destoyImage(lessonContent.heroImageUrl);
      await LessonContentModel.findByIdAndDelete(lessonContent._id);
    }
  }
};

export const destoyImage = async (url?: string | null) => {
  if (!url) return;
  const publicId = extractCloudinaryPublicIdFromUrl(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error deleting Cloudinary image: ${publicId}`, error);
    }
  }
};
