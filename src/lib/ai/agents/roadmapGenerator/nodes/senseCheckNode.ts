import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { State } from '../state';
import { model } from '@/lib/ai/models';

const validationSchema = z.object({
  isValid: z.boolean().describe('Whether the learning goal and current knowledge are valid inputs'),
  message: z.string().describe('A brief explanation of why the input is valid or invalid'),
});

const validationPrompt = ChatPromptTemplate.fromTemplate(`
    You are an expert educational planner and AI course generator.
    
    Your task is to evaluate whether the following learning goal and current knowledge statement 
    are valid input for creating a meaningful educational roadmap.
    
    Learning Goal: {learningGoal}
    
    IMPORTANT: Be EXTREMELY flexible and permissive with learning goals. Users often express 
    their learning goals in short phrases, with typos, or unconventional wording - these are all 
    valid inputs that you should ACCEPT as long as they convey any discernible learning intention.
    
    Determine if:
    1. The learning goal can be reasonably interpreted as an educational objective, even with typos or unusual phrasing
    2. The inputs provide enough context to generate a meaningful learning path
    
    Valid inputs include:
    - Brief but clear technology/skill requests (e.g., "node js dev", "python", "data science")
    - Career-oriented goals (e.g., "become a frontend developer", "data analyst skills")
    - Hobby learning goals (e.g., "digital photography", "home cooking")
    - Even very simple requests like "javascript" or "web development" are valid
    - Misspelled or unconventional phrases that still suggest a learning topic (e.g., "swerd fight mastery" for sword fighting, "kwantum fiziks" for quantum physics)
    - ANY input that has some discernible educational meaning, even if oddly expressed
    
    ONLY reject inputs that are CLEARLY:
    - Complete random characters or gibberish with no discernible meaning (e.g., "asdfghjkl", "123456")
    - Entirely nonsensical statements with no possible educational interpretation
    - Harmful, illegal, or unethical learning goals
    - Completely empty inputs or single character inputs
    
    When current knowledge is missing or minimal, that's OK - simply consider it as a beginner level.
    
    BE VERY PERMISSIVE - if there's ANY chance the input could be interpreted as a learning goal, even with typos or unconventional phrasing, ACCEPT it.
    
    Provide your evaluation as a structured response with:
    - Whether the input is valid (true/false)
    - A brief explanation message explaining your reasoning or providing feedback to the user
  `);

export const senseCheckNode = async (state: typeof State.State) => {
  try {
    const structuredLLM = model.withStructuredOutput(validationSchema);

    const validationResult = await validationPrompt.pipe(structuredLLM).invoke({
      learningGoal: state.learningGoal,
      currentKnowledge: state.currentKnowledge,
      overrideInstructions: state.overrideInstructions,
    });

    return {
      validInput: validationResult.isValid,
      validationMessage: validationResult.message,
    };
  } catch (error) {
    console.error('Error in sense check node:', error);
    return {
      validInput: false,
      validationMessage: 'An error occurred while validating your input. Please try again.',
    };
  }
};
