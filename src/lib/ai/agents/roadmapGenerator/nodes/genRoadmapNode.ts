import { model } from '@/lib/ai/models';
import { DifficultyLevel } from '@/lib/mongo/models/CourseModel';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';
import { State } from '../state';

const schema = z.object({
  courseDescription: z.string().describe('Concise and engaging summary of the recommended learning path.'),
  tags: z.array(z.string()).describe('Tags of the recommended learning path.'),
  courseTitle: z.string().describe('Concise title of the recommended learning path.'),
  completionHours: z.number().describe('Optimal number of hours recommended to complete the course.'),
  difficultyLevel: z
    .enum([
      DifficultyLevel.Foundation,
      DifficultyLevel.Beginner,
      DifficultyLevel.Intermediate,
      DifficultyLevel.Advanced,
    ])
    .describe('Difficulty level of the recommended learning path.'),
  roadmap: z
    .array(
      z.object({
        id: z.string().describe('Unique identifier for the module. Use simple numeric IDs like "1", "2", "3", etc.'),
        title: z.string().describe('Concise title of the learning module'),
        description: z.string().describe('Description of what the module covers'),
        longDescription: z.string().describe(`
              A natural, flowing description that covers in prose form:
              - What will be learned in this module
              - Key concepts and skills
              - Prerequisites and dependencies
              - Expected learning outcomes
              - The module's place in the overall course
              
              The description should be detailed, conversational, and unique for each module (avoiding templated structures), 
              while being comprehensive enough to guide AI-generated lesson content.
            `),
        isRequired: z.boolean().describe('Whether this module is required or optional'),
        level: z.number().describe('Depth level in the roadmap (1 for top level, 2 for second level, etc.)'),
        estimatedHours: z.number().describe('Estimated number of hours to complete the module'),
      }),
    )
    .describe('Ordered list of learning modules that form a structured roadmap'),
  edges: z
    .array(
      z.object({
        id: z.string().describe('Unique identifier for the edge (format MUST be "e[source]-[target]", e.g., "e1-2")'),
        source: z.string().describe('ID of the source module where the edge starts (must match a module ID)'),
        target: z.string().describe('ID of the target module where the edge ends (must match a module ID)'),
      }),
    )
    .describe(
      'Connections between modules showing the learning path progression. Each edge MUST connect modules from a higher level to a lower level only.',
    ),
});

const prompt = ChatPromptTemplate.fromTemplate(`
    You are an expert educational planner and online course generator, acting as a charismatic and engaging mentor, a true top 1% professional of the subject.
    
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
    - Avoid using 'Welcome to the exciting world of..',  'Welcome to the world of..', etc.
  
    Given the user's learning goal and their current knowledge, generate:
    - a concise, engaging description of a recommended learning course(avoid using 'embark', 2 - 4 sentences).
    - a list of tags for the recommended learning path (max 5 tags).
    - a concise title of the recommended learning path.
    - an estimated optimal number of hours to complete the course.
    - a difficulty level of the recommended learning path.
    - a structured roadmap of learning modules in a logical progression.
    - connections between modules to visualize the learning path.
  
    Learning Goal: {learningGoal}
    Current Knowledge: {currentKnowledge}
    
    The description should clearly summarize what the course will cover, emphasizing the learner's goal and accounting for their current knowledge. Suggest briefly the expected outcomes.
  
    This course is designed for online self-study, so the structure should be clear, engaging, and easy to follow independently.
  
    For the roadmap, create a sensible amount of learning modules organized by level:
    Modules should not be long, they should be a good size to be manageable and engaging for the learner.
    Pre-alocate module estimated hours(max 5 hours) based on the complexity of the module and the time it will take the learner to complete it, only then proceed with the other details. Thinkt throughly.
    You should try adding more modules than minimal required modules as this will make the course more engaging and comprehensive.
    Module should never exceed 5 hours of content - very important.
    - IMPORTANT: Vary module durations based on topic complexity and importance:
    * More complex or foundational topics should have longer durations
    * Simpler or supplementary topics can have shorter durations
    * Avoid making all modules the same length
    
    - Level 1 modules are foundational topics
    - Higher level modules build upon previous knowledge
    - Each module should have a clear title and description
    - Mark modules as required or optional
    - Ensure a logical progression from basics to advanced topics
    - Consider the learner's current knowledge when determining starting points
    - IMPORTANT: Design modules with a clear intent of how they will connect to each other
  
    For each module's longDescription, write a flowing narrative paragraph that weaves together:
    - A comprehensive overview of the module's content
    - The key concepts and skills covered
    - Any prerequisites or dependencies
    - The expected learning outcomes
    - How this module fits into the overall learning journey
    
    Important: Each longDescription should be unique and conversational, avoiding bullet points or rigid structures.
    Write as if you're directly speaking to the learner about what they'll experience in the module.
    Make each description feel distinct rather than following a template.
    The tone should be engaging and encourage curiosity about the content.
  
    IMPORTANT: Each module should be designed to contain multiple lessons (in future development). 
    - Structure modules as coherent thematic units that can be broken down into 10-45 minutes lessons
    - Ensure each module represents a complete conceptual area that makes sense to group together
    - Each module should have a reasonable scope
    - Consider the time allocation carefully when designing modules
    - CRITICAL: Maintain STRICT THEMATIC COHERENCE between each module and its lessons
    - Every lesson within a module MUST directly relate to the module's specific theme and title
    - Never include general programming or unrelated concepts in a specialized module
    - For example, a module on "Advanced HTML and CSS" should ONLY contain lessons about HTML and CSS techniques, not about version control, deployment, or other general development topics
    
    Structure the roadmap so learners can follow it sequentially, with dependencies clearly implied by the level numbering.
    
    CRITICAL - For the edges (connections between modules), you MUST follow these strict rules:
    1. FIRST create all modules with clear numeric IDs (like "1", "2", "3") and assign appropriate levels
    2. THEN create edges that connect these modules following a strict hierarchical pattern
    3. Module IDs MUST be simple numeric strings (e.g., "1", "2", "3")
    4. Edge IDs MUST follow the format "e[source]-[target]" exactly (e.g., "e1-3" connects module "1" to module "3")
    5. Each edge MUST connect a module from a higher level to a module in a lower level (strictly downward flow)
    6. NEVER create edges between modules at the same level
    7. NEVER create edges that go from a lower level to a higher level (no upward flow)
    8. Every module (except some level 1 modules) MUST have at least one incoming edge
    9. Every required module MUST have at least one outgoing edge (unless it's a terminal module)
    10. Optional modules can exist without outgoing edges
    11. Check all edges before finalizing to ensure they connect valid module IDs
    
    After creating your modules and edges, VERIFY that:
    - Each edge's source and target IDs match existing module IDs
    - The connections form a valid directed acyclic graph (DAG)
    - The flow strictly follows the level hierarchy (higher levels to lower levels)
    - There are no isolated modules without connections
    - All required paths lead to completion of the course
    
    {overrideInstructions}
    `);

export const genRoadmapNode = async (state: typeof State.State) => {
  try {
    const structuredLLM = model.withStructuredOutput(schema);

    const result = await prompt.pipe(structuredLLM).invoke({
      learningGoal: state.learningGoal,
      currentKnowledge: state.currentKnowledge,
      overrideInstructions: state.overrideInstructions,
    });

    return {
      result,
    };
  } catch (error) {
    console.error('Error in genRoadmap node:', error);
    throw error;
  }
};
