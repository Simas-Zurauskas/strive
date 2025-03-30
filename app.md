# Strive – Revolutionary AI-Powered Learning Roadmaps

## Overview

Strive revolutionizes self-directed education with an AI-driven platform that generates precision-engineered learning roadmaps tailored to individual users' learning goals and current skill levels. Unlike traditional one-size-fits-all courses, Strive constructs a structured, adaptive path that efficiently guides proactive learners to mastery through a personalized learning journey.

## Why Strive is Revolutionary

- **Precision Learning**: Eliminates wasted time on irrelevant content by analyzing your exact skill gaps.
- **Adaptive Intelligence**: Roadmaps evolve based on your progress and changing learning needs.
- **Visual Knowledge Architecture**: Complex learning paths presented in an intuitive visual format that clarifies relationships between concepts.
- **Self-Directed Empowerment**: Built for ambitious, proactive learners who demand structure and efficiency.

## User Journey

### 1. Defining Learning Goals

- Users clearly define their learning objectives using natural language (e.g., "Become a backend developer with Node.js").
- Users specify their current knowledge level (e.g., "I know basic HTML and CSS").

### 2. Customizing AI Suggestions

- Strive provides AI-generated suggestions for course title, recommended duration (in hours), and overall course difficulty.
- Users can override AI suggestions to further tailor their learning experience according to personal preferences.

### 3. Roadmap Generation

- Strive generates a roadmap structured as a tree of interconnected nodes, outlining a clear path toward the user's learning goal.
- Each node represents a distinct learning module.
- Nodes link strictly downward from foundational to advanced modules, maintaining a logical progression.

**Types of Nodes**:

- **Required Node**: Essential to progress further in the course.
- **Optional Node**: Additional but non-essential content that enriches understanding.

### 4. Course Duration and Node Hours

- Strive estimates the ideal total hours required for completing the course.
- Course hours are distributed logically across nodes based on their content complexity and importance.
- If users provide a custom total course length, Strive redistributes hours according to this preference.

### 5. Content Generation

- Upon user approval of the roadmap, Strive generates comprehensive learning modules using AI.
- Each module is formatted in Markdown (MD), including structured text content, relevant images, and links to supplementary resources.
- Content is thoughtfully organized to facilitate effective learning, with structured sections, summaries, and key takeaways.
- Given module complexity, Strive employs internal summarization and multiple retrieval-augmented generation (RAG) calls to ensure accurate, relevant, and comprehensive content.

### 6. Chatbots for Contextual Mentorship

Strive offers AI-powered mentor chatbots at three contextual levels:

- **Course-Level Mentor**: Provides high-level guidance on course progression, goal-setting, motivation, and broader concepts.
- **Module-Level Mentor**: Offers support focused on specific modules, clarifying concepts, module completion strategies, and answering targeted questions related directly to module objectives.
- **Lesson-Level Mentor**: Delivers granular assistance within individual lessons, resolving detailed queries, explaining difficult concepts, and supporting immediate problem-solving.

Each chatbot understands and adapts to the user's learning context, providing personalized and precise mentorship at the relevant scope, thereby enhancing learner confidence and retention.

### 7. Database Structure and Course Management

- Courses and modules are saved progressively to the database as each module is generated.
- Nodes include metadata: expected learning hours, actual content length, completion status, and user-specific adjustments.
- Users can track their progress through clear status indicators (e.g., "Complete" or "Incomplete").

## Credits and Pricing System

Users maintain an account with a credits-based system for accessing and generating content:

- **Roadmap Generation**: 1 credit per roadmap.
- **Module Generation**: 1 credit per module.
- **Lesson Generation**: 2 credits per detailed lesson.
- Credits are clearly communicated and deducted based on content generation requests.
- New users receive 30 credits upon registration.

## User Progress and Interface

The user interface visually represents the roadmap as an interactive tree structure, highlighting current progress, completed nodes, and pending modules.

Users seamlessly interact with personalized learning content, easily accessing modules, lessons, and chatbot mentorship from their account dashboard.

## For Ambitious Learners

Strive is designed for self-starters who understand that structured learning paths lead to faster mastery. By removing the guesswork from "what to learn next," Strive empowers driven individuals to channel their energy directly into skill acquisition and personal development.

strive-learning.com if you're looking to learn anything, even super niche topics. You can customize it for a quick crash course or a deep dive, pick your own difficulty level, and it's practically free. Really handy if you're into structured self-learning!
