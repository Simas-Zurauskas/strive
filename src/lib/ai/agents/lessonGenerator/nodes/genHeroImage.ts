import CourseModel from '@/lib/mongo/models/CourseModel';
import { NodeFunctionOutput } from '../types';
import OpenAI from 'openai';
import cloudinary from '@/lib/croudinary';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const genHeroImage: NodeFunctionOutput = async (state) => {
  console.log('__NODE__ genHeroImage');
  try {
    const course = await CourseModel.findOne({ uxId: state.uxId });
    if (!course || !state.moduleId) {
      throw new Error('Course or moduleId not found');
    }

    const targetModule = course.modules.roadmap.find((module) => module.id === state.moduleId);
    if (!targetModule) {
      throw new Error(`Module with ID ${state.moduleId} not found in course roadmap`);
    }

    // @ts-ignore
    const targetLesson = targetModule.lessons.find((el) => el._id.toString() === state.lessonId);
    if (!targetLesson) {
      throw new Error(`Lesson with ID ${state.lessonId} not found in module ${state.moduleId}`);
    }

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a hero image that directly represents the concept of "${targetLesson.title}" in the course "${
        course.details.courseTitle.override || course.details.courseTitle.value
      }".

    IMPORTANT: Do NOT include any text, words, letters, numbers, or symbols in the image.

    The image should be:
    - A clean, visual representation focusing on the core concept of the lesson
    - Simple and uncluttered with minimal elements
    - Use a color palette with vibrant yellows and oranges as accent colors

    Keep the design professional and educational, suitable for a learning platform. Focus on conveying the lesson concept through visual elements only.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    const heroImageUrl = response.data[0].url!;

    const uploadResult = await cloudinary.uploader.upload(heroImageUrl, {
      public_id: `strive/${process.env.CLOUDINARY_ENV}/lesson_hero_${state.lessonId}`,
    });

    return {
      // heroImageUrl: '',
      heroImageUrl: uploadResult?.secure_url,
    };
  } catch (error) {
    console.error('Error in genHeroImage:', error);
    return {};
  }
};
