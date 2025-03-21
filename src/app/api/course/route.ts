import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { FormValues } from '@/screens/CourseEditScreen/types';
import CourseModel from '@/lib/mongo/models/CourseModel';
import { GenCourseResponse } from '@/requests/types';
import { printGraphImage } from '../util';
import roadmapGenerator from '@/lib/ai/agents/roadmapGenerator';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as FormValues;

    const difficultyLevelOverride = body.details?.difficultyLevel?.override;
    const completionHoursOverride = body.details?.completionHours?.override;

    let overrideInstructions = '';

    if (difficultyLevelOverride) {
      overrideInstructions += `IMPORTANT: The user has explicitly requested a ${difficultyLevelOverride} difficulty level. You MUST set the difficulty level to ${difficultyLevelOverride} and adjust the roadmap content accordingly.\n`;
    }

    if (completionHoursOverride) {
      overrideInstructions += `IMPORTANT: The user has explicitly requested a total course duration of ${completionHoursOverride} hours. You MUST set the completion hours to ${completionHoursOverride} and adjust the roadmap scope and depth accordingly.\n`;
    }

    const graph = roadmapGenerator();
    printGraphImage(graph, 'graph-roadmap');

    const finalState = await graph.stream({
      learningGoal: body.initial.learningGoal,
      currentKnowledge: body.initial.currentKnowledge,
      overrideInstructions: overrideInstructions || 'Generate recommendations based on your best judgment.',
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let roadmap = {} as any;
          for await (const chunk of finalState) {
            // console.log('CHUNK>', chunk);

            if (chunk.validateInput) {
              if (chunk.validateInput.validInput === false) {
                controller.enqueue(
                  encoder.encode(
                    JSON.stringify({
                      error: 'Invalid input',
                      message:
                        chunk.validateInput.validationMessage || 'Please check your learning goal and try again.',
                    }) + '\n',
                  ),
                );
                controller.close();
                return;
              } else {
                controller.enqueue(encoder.encode(JSON.stringify({ message: 'Generating learning roadmap' }) + '\n'));
              }
            }
            if (chunk.genRoadmap) {
              roadmap = chunk.genRoadmap.result;
            }
          }

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                result: {
                  details: {
                    courseDescription: roadmap.courseDescription,
                    tags: roadmap.tags,
                    courseTitle: { value: roadmap.courseTitle },
                    completionHours: { value: roadmap.completionHours },
                    difficultyLevel: { value: roadmap.difficultyLevel },
                  },
                  modules: {
                    roadmap: roadmap.roadmap,
                    edges: roadmap.edges,
                  },
                } as GenCourseResponse,
              }) + '\n',
            ),
          );

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'application/json' },
    });

    // if (!finalState.validInput) {
    //   return NextResponse.json(
    //     {
    //       error: 'Invalid input',
    //       message: finalState.validationMessage,
    //     },
    //     { status: 400 },
    //   );
    // }
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courses = await CourseModel.find({ user: user.id });

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
