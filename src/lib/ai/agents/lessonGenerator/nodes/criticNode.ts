import { NodeFunctionOutput } from '../types';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { model } from '@/lib/ai/models';
import { z } from 'zod';
import { getResources } from '../util';

const criticSchema = z.object({
  feedback: z.string().describe('Comprehensive, actionable feedback combining all evaluation aspects'),
  score: z.number().describe('Overall score for the lesson from 1 to 10'),
});

const expertCriticPrompt = ChatPromptTemplate.fromTemplate(`
You are a subject matter expert and technical professional, responsible for evaluating educational content from an EXPERT'S PERSPECTIVE.

Your task is to critically assess a lesson, focusing on the technical quality of the content. You'll evaluate the material strictly from an expert's point of view, assessing accuracy, comprehensiveness, relevance, and depth of insights.

# LESSON CONTEXT
Course Title: {courseTitle}
Course Description: {courseDescription}
Course Difficulty: {courseDifficulty}
Module Title: {moduleTitle}
Module Description: {moduleDescription}

# LESSON DETAILS
Title: {lessonTitle}
Description: {lessonDescription}
Content Outline: {lessonContentOutline}
Expected Duration (minutes): {lessonExpectedDuration}

# CONTENT TO EVALUATE
{lessonContent}

# EVALUATION CRITERIA
Evaluate the following aspects of the technical quality:

## 1. TECHNICAL ACCURACY
- Is all information factually correct and up-to-date?
- Are there any technical errors, misunderstandings, or outdated information?
- Are technical terms used correctly and consistently?
- Are explanations of concepts technically sound?
- Do code examples or technical demonstrations follow best practices?

## 2. COMPREHENSIVENESS
- Are all important aspects of the topic covered?
- Are there any significant omissions or gaps in the content?
- Is the scope appropriate for the lesson objectives?
- Is there sufficient depth on core concepts?
- Are edge cases and limitations appropriately addressed?

## 3. INDUSTRY RELEVANCE
- Does the content align with current industry practices?
- Are the technologies, tools, or methodologies current and relevant?
- Does the lesson reflect how concepts are applied in real-world professional contexts?
- Are examples relevant to modern professional scenarios?
- Would the knowledge be valuable in today's workplace?

## 4. ADVANCED INSIGHTS
- Does the content provide deeper understanding beyond basics?
- Are there insights that demonstrate expert-level thinking?
- Does it include nuanced perspectives or sophisticated approaches?
- Are there connections to broader concepts or advanced applications?
- Does it prepare learners for more complex aspects of the subject?

## 5. OVERALL TECHNICAL QUALITY
- Considering all aspects, how would you rate the overall technical quality?
- What are the primary technical strengths and weaknesses?
- What prioritized, actionable feedback would most improve the technical quality?
- Does this lesson need revision based on the technical quality criteria?

# EVALUATION INSTRUCTIONS
1. Be thorough but fair in your technical assessment
2. Provide specific examples from the content to justify your points
3. Give actionable, constructive feedback for technical improvement
4. Consider industry standards and current best practices
5. Focus exclusively on technical quality, not student engagement aspects

# RESPONSE FORMAT
Your evaluation should result in TWO outputs:

1. A score from 1-10 representing the overall technical quality
2. A comprehensive, well-structured feedback section that:
   - Combines insights from all evaluation criteria
   - Clearly identifies technical strengths and weaknesses
   - Provides specific, actionable recommendations for improvement
   - Prioritizes the most critical technical issues first
   - Uses concrete examples from the content
   - Is written with professional authority but constructive tone

The combined feedback should be technically precise, focusing on the most impactful improvements from an expert's perspective.
`);

const studentCriticPrompt = ChatPromptTemplate.fromTemplate(`
You are an experienced educator and learning specialist, responsible for evaluating educational content from a STUDENT'S PERSPECTIVE.

Your task is to critically assess a lesson, focusing on the learning experience it provides. You'll evaluate the content strictly from a student's point of view, considering how engaging, clear, appropriate, and useful it is for the target audience.

# LESSON CONTEXT
Course Title: {courseTitle}
Course Description: {courseDescription}
Course Difficulty: {courseDifficulty}
Module Title: {moduleTitle}
Module Description: {moduleDescription}

# LESSON DETAILS
Title: {lessonTitle}
Description: {lessonDescription}
Content Outline: {lessonContentOutline}
Expected Duration (minutes): {lessonExpectedDuration}

# CONTENT TO EVALUATE
{lessonContent}

# EVALUATION CRITERIA
Evaluate the following aspects of the student experience:

## 1. CLARITY AND UNDERSTANDABILITY
- How clearly are concepts explained?
- Is terminology well-defined and appropriately introduced?
- Is the content structured in a logical, easy-to-follow manner?
- Are explanations free from unnecessarily complex language or jargon?
- Are complex ideas broken down into digestible parts?

## 2. ENGAGEMENT LEVEL
- Does the content maintain interest throughout?
- Are there hooks, questions, or scenarios that capture attention?
- Does the lesson use varied approaches to keep the learner engaged?
- Is the tone conversational and relatable?
- Are there interesting examples, stories, or analogies that make concepts memorable?

## 3. APPROPRIATENESS FOR TARGET KNOWLEDGE LEVEL
- Does the content match the stated course difficulty level?
- Are concepts introduced at an appropriate pace?
- Does the lesson build appropriately on previous knowledge?
- Are there any sections that seem too advanced or too basic for the target audience?
- Is the right amount of scaffolding provided for complex ideas?

## 4. PRACTICAL USEFULNESS
- Does the lesson provide applicable knowledge and skills?
- Are there sufficient examples of real-world applications?
- Does the content connect theory to practice effectively?
- Does the lesson prepare the learner to apply the knowledge independently?
- Would a student find this lesson valuable for their learning goals?

## 5. OVERALL STUDENT EXPERIENCE
- Considering all aspects, how would you rate the overall student experience?
- What are the primary strengths and weaknesses from a student perspective?
- What prioritized, actionable feedback would most improve the student experience?
- Does this lesson need revision based on the student experience criteria?

# EVALUATION INSTRUCTIONS
1. Be thorough but fair in your assessment
2. Provide specific examples from the content to justify your points
3. Give actionable, constructive feedback for improvement
4. Consider the lesson in the context of the overall course and student goals
5. Focus exclusively on the student experience, not technical content accuracy

# RESPONSE FORMAT
Your evaluation should result in TWO outputs:

1. A boolean determination of whether the lesson needs revision (true/false)
2. A comprehensive, well-structured feedback section that:
   - Combines insights from all evaluation criteria
   - Clearly identifies strengths and weaknesses
   - Provides specific, actionable recommendations
   - Prioritizes the most important improvements first
   - Uses concrete examples from the content
   - Is written in a constructive, helpful tone

The combined feedback should be thorough but concise, focusing on the most impactful improvements.
`);

const structuredLLM = model.withStructuredOutput(criticSchema);

export const criticNode: NodeFunctionOutput = async (state) => {
  const totalRevisions = (state.criticEvaluation?.totalRevisions || 0) + 1;
  // const needsRevision = totalRevisions < 2;
  const needsRevision = totalRevisions < 2;

  console.log('__NODE__ criticNode', {
    totalRevisions,
    needsRevision,
  });

  if (!needsRevision) {
    return {
      ...state,
      criticEvaluation: {
        totalRevisions,
        needsRevision,
        feedbackStudent: 'The lesson is good as it is!',
        feedbackExpert: 'The lesson is good as it is!',
      },
    };
  }

  const { course, targetModule, targetLesson } = await getResources({
    uxId: state.uxId,
    moduleId: state.moduleId,
    lessonId: state.lessonId,
  });

  const promptInput = {
    // COURSE
    courseTitle: course.details.courseTitle.override || course.details.courseTitle.value,
    courseDescription: course.details.courseDescription,
    courseDifficulty: course.details.difficultyLevel.override || course.details.difficultyLevel.value,
    // MODULE
    moduleTitle: targetModule.title,
    moduleDescription: targetModule.description,
    // LESSON
    lessonTitle: targetLesson.title,
    lessonDescription: targetLesson.description,
    lessonContentOutline: targetLesson.contentOutlineSpec,
    lessonExpectedDuration: targetLesson.durationMinutes,
    // CONTENT
    lessonContent: state.lessonContent,
  };

  const expertPromise = expertCriticPrompt.pipe(structuredLLM).invoke(promptInput);
  const studentPromise = studentCriticPrompt.pipe(structuredLLM).invoke(promptInput);

  const [expertResult, studentResult] = await Promise.all([expertPromise, studentPromise]);

  console.log('expertResult', expertResult);
  console.log('studentResult', studentResult);

  return {
    ...state,
    criticEvaluation: {
      totalRevisions,
      needsRevision,
      feedbackStudent: studentResult.feedback,
      feedbackExpert: expertResult.feedback,
    },
  };
};
