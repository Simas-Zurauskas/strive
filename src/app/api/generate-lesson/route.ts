import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { printGraphImage } from '../util';
import CourseModel from '@/lib/mongo/models/CourseModel';
import lessonGenerator from '@/lib/ai/agents/lessonGenerator';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { uxId, moduleId, lessonId } = body as { uxId: string; moduleId: string; lessonId: string };

    const courseExists = await CourseModel.exists({
      user: user.id,
      uxId,
    }).lean();

    if (!courseExists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const graph = await lessonGenerator();
    printGraphImage(graph, 'graph-lessongen');

    const finalState = await graph.stream({
      uxId,
      moduleId,
      lessonId,
    });
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let result = { lessonContent: '', heroImageUrl: '' };
          for await (const chunk of finalState) {
            // console.log('CHUNK>', chunk);

            if (chunk.genLesson) {
              // controller.enqueue(encoder.encode(JSON.stringify({ message: 'YO' }) + '\n'));
              result.lessonContent = chunk.genLesson.lessonContent;
            }

            if (chunk.genHeroImage) {
              result.heroImageUrl = chunk.genHeroImage.heroImageUrl;
            }
          }

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                result,
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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
