# Strive – AI-Powered Personalized Learning Roadmap

## Overview

Strive is an AI-driven educational platform designed to generate personalized learning roadmaps tailored to individual users' learning goals and current skill levels. Users specify their desired learning outcome, current knowledge base, and course depth preferences, and Strive constructs a structured roadmap to efficiently guide their learning journey.

## User Journey

### 1. Defining Learning Goals

- Users clearly define their learning objectives using natural language (e.g., "Become a backend developer with Node.js").
- Users specify their current knowledge level (e.g., "I know basic HTML and CSS").

### 2. Customizing AI Suggestions

- Strive provides AI-generated suggestions for course title, recommended duration (in hours), and overall course difficulty.
- Users have the option to override these AI suggestions to customize their learning experience according to personal preferences.

### 3. Roadmap Generation

- Strive generates a roadmap structured as a tree of interconnected nodes, outlining a clear path toward the user's learning goal.
- Each node represents a distinct learning module.
- Nodes link strictly downward from foundational to advanced modules, maintaining a logical progression.

**Types of Nodes:**

- **Required Node:** Essential to progress further in the course.
- **Optional Node:** Additional but non-essential content that enriches understanding.

### 4. Course Duration and Node Hours

- Strive estimates the ideal total hours required for completing the course.
- Course hours are distributed logically across nodes based on their content complexity and importance.
- If users provide a custom total course length, Strive redistributes hours according to this preference.

### 5. Content Generation

- Upon user approval of the roadmap, Strive generates comprehensive learning modules using AI.
- Each module is formatted in Markdown (MD), including structured text content, relevant images, and links to supplementary resources.
- Content is thoughtfully organized to facilitate effective learning, with clearly structured sections, summaries, and key takeaways.
- Given the potential complexity of module generation, Strive employs internal summarization and multiple retrieval-augmented generation (RAG) calls to ensure accurate, relevant, and comprehensive content.

### 6. Database Structure and Course Management

- Courses and modules are saved to a database progressively as each module is generated.
- Nodes include metadata: expected learning hours, actual content length, completion status, and user-specific adjustments.
- Users can track progress within their personalized roadmap through clear status indicators (e.g., "Complete" or "Incomplete").

## Credits and Pricing System

Users maintain an account with a credits-based system for accessing and generating content:

- **Roadmap Generation:** 1 credit per roadmap.
- **Module Generation:** 1 credit per module.
- **Lesson Generation:** 2 credits per lesson (individual, detailed content within modules).

Credits are deducted based on content generation requests, clearly communicated to the user at each step.
User signing will be granted 30 credits.

## User Progress and Interface

The user interface visually represents the roadmap as an interactive tree structure, highlighting current progress, completed nodes, and pending modules.

Users interact seamlessly with their personalized learning content, accessing generated lessons and modules clearly organized within their account dashboard.
