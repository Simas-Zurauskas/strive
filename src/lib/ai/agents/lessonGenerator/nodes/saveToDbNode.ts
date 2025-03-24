import { NodeFunctionOutput } from '../types';
import LessonContentModel, { LessonContentDocument } from '@/lib/mongo/models/LessonContent';
import { getResources } from '../util';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { model } from '@/lib/ai/models';
import { z } from 'zod';

const schema = z.object({
  summary: z.string().describe('A concise summary of the lesson content'),
});

const structuredLLM = model.withStructuredOutput(schema);

// Prompt for generating a concise lesson summary
const lessonSummaryPrompt = ChatPromptTemplate.fromTemplate(`
You are an educational content summarizer, responsible for creating concise but comprehensive summaries of lesson content.

Your task is to summarize the given lesson into a brief overview that captures the key concepts, techniques, and learning outcomes. This summary will be used as context for future lesson generation in the learning path.

# LESSON DETAILS
Title: {lessonTitle}
Description: {lessonDescription}
Module: {moduleTitle}
Course: {courseTitle}

# LESSON CONTENT TO SUMMARIZE
{lessonContent}

# SUMMARY REQUIREMENTS
Your summary should:
1. Be between 150-250 words
2. Capture the 3-5 most important concepts or techniques covered in the lesson
3. Highlight key learning outcomes and practical applications
4. Mention any fundamental principles or frameworks introduced
5. Include relevant terminology that would be built upon in future lessons
6. Be written in a neutral, informative style
7. Be organized in a clear, structured format with bullet points for key concepts

# FORMAT
Please structure your summary as follows:
- One paragraph overview (2-3 sentences)
- Bullet list of key concepts/techniques (3-5 points)
- One paragraph on practical applications or implications
- One sentence connecting this lesson to the broader learning journey

The summary should be concise but specific enough to provide valuable context for generating connected lessons.
`);

export const saveToDbNode: NodeFunctionOutput = async (state) => {
  console.log('__NODE__ saveToDbNode');

  try {
    const { course, targetModule, targetLesson } = await getResources({
      uxId: state.uxId,
      moduleId: state.moduleId,
      lessonId: state.lessonId,
    });

    const { summary } = await lessonSummaryPrompt.pipe(structuredLLM).invoke({
      lessonTitle: targetLesson.title,
      lessonDescription: targetLesson.description,
      moduleTitle: targetModule.title,
      courseTitle: course.details.courseTitle.override || course.details.courseTitle.value,
      lessonContent: state.lessonContent,
    });

    let lessonContent: LessonContentDocument | null;

    const body = {
      md: state.lessonContent,
      heroImageUrl: state.heroImageUrl,
      summary,
    };

    if (targetLesson.content) {
      lessonContent = await LessonContentModel.findByIdAndUpdate(targetLesson.content, body, { new: true });

      if (!lessonContent) {
        throw new Error(`Lesson content with ID ${targetLesson.content} not found for update`);
      }
    } else {
      lessonContent = await LessonContentModel.create({ ...body, course: course._id });

      // @ts-ignore
      targetLesson.content = lessonContent._id;
      await course.save();
    }

    if (!lessonContent._id) {
      throw new Error('Lesson content not found');
    }

    return {};
  } catch (error) {
    console.error('Error in saveToDbNode:', error);
    return {};
  }
};
