import CourseModel from '@/lib/mongo/models/CourseModel';
import { InputState } from '../state';
import { NodeFunctionOutput } from '../types';
import { z } from 'zod';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { model } from '@/lib/ai/models';

const roundToNearest5IfOver30 = (value: number): number => {
  if (value <= 30) return value;
  return Math.round(value / 5) * 5;
};

const schema = z.object({
  lessons: z
    .array(
      z.object({
        order: z.number().describe('Sequential number starting from 1'),
        title: z.string().describe('Clear, descriptive title reflecting specific content'),
        description: z.string().describe('Description of the lesson, should be 2-4 sentences'),
        durationMinutes: z.number().describe('The duration of the lesson in minutes.'),
        contentOutlineSpec: z
          .string()
          .describe(
            'Detailed breakdown of purely informational lesson content including objectives, concepts, examples, explanations, ...etc',
          ),
      }),
    )
    .describe('Collection of lessons whose total duration MUST EXACTLY equal the module estimated minutes'),
});

const prompt = ChatPromptTemplate.fromTemplate(`
You are an expert educational content creator tasked with breaking down a learning module into well-structured, engaging lessons, acting as a charismatic and engaging mentor, a true top 1% professional of the subject.
    
Your teaching personality should be:
- Warm and encouraging, making learners feel supported and capable
- Patient and understanding, breaking down complex concepts into digestible parts
- Professional yet approachable, using a conversational tone that builds rapport
- Motivating and inspiring, helping learners stay engaged and committed
- Empathetic to learning challenges, offering practical solutions and encouragement
- Confident in your expertise while remaining humble and relatable
- Using analogies and real-world examples to make concepts more relatable
- Celebrating small wins and progress to maintain motivation
- Adapting your teaching style to match the learner's needs and experience level
- Shorter lesssons are easier to consume and more engaging, keep this in mind when planning the lessons

# CONTENT TYPE
This course consists of PURELY INFORMATIONAL CONTENT. Do NOT include quizzes, interactive exercises, or assessments.
Focus on clear explanations, examples, and thorough coverage of concepts through text-based content.

# CONTEXT
Course Title: {courseTitle}
Course Description: {courseDescription}
Course Difficulty: {courseDifficulty}
Total Course Hours: {totalCourseHours}

# TARGET MODULE INFORMATION
Module Title: {moduleTitle}
Module Description: {moduleDescription}
Module Long Description: {moduleLongDescription}
Module Estimated Hours: {moduleEstimatedHours}
Module Required: {moduleIsRequired}

# MODULE CONTEXT IN COURSE ROADMAP
{moduleContext}

You must think here carefully and throughly!

# TIME LESSONS PLANNING PROCESS
  - Create {totalLessons} lessons for this module - This is a VERY strict requirement
  - Pre-allocate planned lesson durationMinutes to all lessons and ensure that the total duration is equal to {moduleEstimatedMinutes} minutes - This is a strict requirement
  - IMPORTANT: Vary lesson durations based on topic complexity and importance:
    * More complex or foundational topics should have longer durations
    * Simpler or supplementary topics can have shorter durations
    * Avoid making all lessons the same length
  - Each lesson should build upon previous lessons in a coherent learning sequence
  - Design lessons to be informative and engaging with clear explanations and examples
  - Ensure lessons collectively fulfill all learning objectives mentioned in the module description
  - Try to add more lessons than minimal required lessons as this will make the course more engaging and comprehensive

# OUTPUT GUIDELINES
Generate an array of lesson objects, each containing:
- order: Sequential number
- title: Clear, descriptive title (avoid generic titles like "Introduction" alone)
- description: 2-3 sentence summary of the lesson content
- durationMinutes: duration in minutes that matches your pre-allocation plan, well-varying based on topic importance and complexity
- contentOutlineSpec: Detailed breakdown of the informational lesson content that will guide future content generation, including:
  * Key learning objectives
    - What learners will be able to do after completing this lesson
    - Specific skills or knowledge they will acquire
    - Measurable outcomes
  * Main concepts to be covered
    - Core principles and theories
    - Essential terminology and definitions
    - Key relationships between concepts
  * Examples and scenarios to illustrate concepts
    - Real-world applications
    - Common use cases
    - Industry best practices
    - Potential pitfalls and how to avoid them
  * Explanations of important principles
    - Step-by-step breakdowns of complex concepts
    - Visual aids and diagrams needed
    - Analogies to simplify complex ideas
  * Practical implementation guidance
    - Code examples (if applicable)
    - Configuration steps
    - Setup instructions
    - Common troubleshooting tips
  * Additional resources and references
    - Official documentation to reference
    - Recommended tools and software
    - Further reading materials
    - Community resources
  * Learning checkpoints
    - Key takeaways from each section
    - Important points to remember
    - Common misconceptions to address
  * Anything else that is relevant to the lesson content - This is a flexible requirement, use your best judgement to add any additional information that is relevant to the lesson content - important.

CRITICAL: You MUST create in range of {totalLessons} lessons for this module - This is a VERY strict requirement, if there are not enough lessons, you must create more and reiterate.
`);

export const genModuleNode: NodeFunctionOutput = async (state: InputState) => {
  try {
    const course = await CourseModel.findOne({ uxId: state.uxId });
    if (!course || !state.moduleId) {
      throw new Error('Course or moduleId not found');
    }

    const targetModule = course.modules.roadmap.find((module) => module.id === state.moduleId);
    if (!targetModule) {
      throw new Error(`Module with ID ${state.moduleId} not found in course roadmap`);
    }

    const incomingModules = course.modules.edges
      .filter((edge) => edge.target === state.moduleId)
      .map((edge) => course.modules.roadmap.find((module) => module.id === edge.source))
      .filter(Boolean);

    const outgoingModules = course.modules.edges
      .filter((edge) => edge.source === state.moduleId)
      .map((edge) => course.modules.roadmap.find((module) => module.id === edge.target))
      .filter(Boolean);

    const moduleContext = `
    Previous Modules: ${
      incomingModules.length ? incomingModules.map((m) => `${m!.title} (${m!.id})`).join(', ') : 'None'
    }
    Next Modules: ${outgoingModules.length ? outgoingModules.map((m) => `${m!.title} (${m!.id})`).join(', ') : 'None'}
    `;

    const moduleEstimatedMinutes = targetModule.estimatedHours * 60;

    const structuredLLM = model.withStructuredOutput(schema);

    const getLessonsCount = (minutes: number) => {
      return Math.round((60 / minutes) * targetModule.estimatedHours);
    };

    const totalLessons = `from ${getLessonsCount(30)} to ${getLessonsCount(5)}`;

    const result = await prompt.pipe(structuredLLM).invoke({
      courseTitle: course.details.courseTitle.override || course.details.courseTitle.value,
      courseDescription: course.details.courseDescription,
      courseDifficulty: course.details.difficultyLevel.override || course.details.difficultyLevel.value,
      totalCourseHours: course.details.completionHours.override || course.details.completionHours.value,
      moduleTitle: targetModule.title,
      moduleDescription: targetModule.description,
      moduleLongDescription: targetModule.longDescription,
      moduleEstimatedHours: targetModule.estimatedHours,
      moduleEstimatedMinutes: moduleEstimatedMinutes,
      moduleIsRequired: targetModule.isRequired ? 'Required' : 'Optional',
      moduleContext: moduleContext,
      totalLessons,
    });

    const generatedLessonsLength = result.lessons.reduce((acc, el) => acc + el.durationMinutes, 0);

    const divergenceFactor = moduleEstimatedMinutes / generatedLessonsLength;

    const adjustedLessons = result.lessons.map((el) => ({
      ...el,
      durationMinutes: roundToNearest5IfOver30(Math.round(el.durationMinutes * divergenceFactor)),
    }));

    targetModule.lessons = adjustedLessons.map((el) => ({
      ...el,
      chat: [],
    }));

    await course.save();

    return {
      lessons: adjustedLessons,
    };
  } catch (error) {
    console.error('Error in genModuleNode:', error);
    return {
      lessons: [],
    };
  }
};
