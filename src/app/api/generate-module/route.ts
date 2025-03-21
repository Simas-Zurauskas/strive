import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import moduleGenerator from '@/lib/ai/agents/moduleGenerator';
import { printGraphImage } from '../util';
import CourseModel from '@/lib/mongo/models/CourseModel';
import mongoDb from '@/lib/mongo/db';

export async function POST(req: NextRequest) {
  await mongoDb();
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { identifier } = body as { identifier: { uxId: string; moduleId: string } };

    const courseExists = await CourseModel.exists({
      user: user.id,
      uxId: identifier.uxId,
    }).lean();

    if (!courseExists) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const graph = moduleGenerator();
    printGraphImage(graph, 'graph-modulegen');

    const finalState = await graph.stream({
      uxId: identifier.uxId,
      moduleId: identifier.moduleId,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let lessons = [];
          for await (const chunk of finalState) {
            // console.log('CHUNK>', chunk);

            if (chunk.genModule) {
              // controller.enqueue(encoder.encode(JSON.stringify({ message: 'YO' }) + '\n'));
              lessons = chunk.genModule.lessons;
            }
          }

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                result: lessons,
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
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
