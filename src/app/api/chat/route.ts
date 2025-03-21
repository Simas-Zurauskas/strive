import chatAssistant from '@/lib/ai/agents/chatAssistant';
import { NextRequest, NextResponse } from 'next/server';
import { printGraphImage } from '../util';
import { getCurrentUser } from '@/lib/auth';

const stringify = (data: any) => JSON.stringify(data) + '\n';

export interface ChatReqBody {
  userInput: string;
  courseUxId: string;
  moduleId: string | null;
  lessonId: string | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatReqBody;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const graph = await chatAssistant();
    printGraphImage(graph, 'graph-chatAssistant');

    const eventStream = await graph.streamEvents(
      {
        messages: [{ role: 'user', content: body.userInput }],
        courseUxId: body.courseUxId,
        moduleId: body.moduleId,
        lessonId: body.lessonId,
      },
      {
        version: 'v2',
      },
    );

    const stream = new ReadableStream({
      async start(controller) {
        for await (const { event, data } of eventStream) {
          if (event === 'on_chat_model_stream') {
            if (!!data.chunk.content) {
              console.log(data.chunk.content);
              controller.enqueue(
                stringify({
                  type: 'text',
                  content: data.chunk.content,
                }),
              );
            }
          }
        }

        controller.enqueue(
          stringify({
            type: 'state',
            data: {
              status: 'idle',
            },
          }),
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        Connection: 'keep-alive',
        'Content-Encoding': 'none',
        'Cache-Control': 'no-cache, no-transform',
        'Content-Type': 'text/event-stream; charset=utf-8',
      },
    });

    const encoder = new TextEncoder();
    // const stream = new ReadableStream({
    //   async start(controller) {
    //     try {
    //       for await (const chunk of finalState) {
    //         console.log('CHUNK>', chunk);

    //         if (chunk) {
    //         }
    //       }

    //       controller.enqueue(
    //         encoder.encode(
    //           JSON.stringify({
    //             result: {},
    //           }) + '\n',
    //         ),
    //       );

    //       controller.close();
    //     } catch (error) {
    //       controller.error(error);
    //     }
    //   },
    // });

    // return new Response(stream, {
    //   headers: { 'Content-Type': 'application/json' },
    // });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
