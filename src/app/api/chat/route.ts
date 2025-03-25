import chatAssistant from '@/lib/ai/agents/chatAssistant';
import { NextRequest, NextResponse } from 'next/server';
import { printGraphImage } from '../util';
import { getCurrentUser } from '@/lib/auth';
import mongoDb from '@/lib/mongo/db';
import { CPointer } from '@/types';

interface ToolEventData {
  tool: string;
  input?: any;
  output?: any;
  error?: any;
}

interface StreamEventData {
  chunk?: {
    content: string;
  };
  tool?: string;
  input?: any;
  output?: any;
  error?: any;
}

const stringify = (data: any) => JSON.stringify(data) + '\n';

export interface ChatReqBody {
  userInput: string;
  cPointer: CPointer;
}

export async function POST(req: NextRequest) {
  await mongoDb();
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
        cPointer: body.cPointer,
      },
      {
        version: 'v2',
      },
    );

    const stream = new ReadableStream({
      async start(controller) {
        for await (const { event, data } of eventStream) {
          if (event === 'on_chat_model_stream') {
            if (!!data.chunk?.content) {
              // console.log(data.chunk.content);
              controller.enqueue(
                stringify({
                  type: 'text',
                  content: data.chunk.content,
                }),
              );
            }
          } else if (event === 'on_tool_start') {
            const toolData = data as ToolEventData;
            console.log('Tool Start:', {
              tool: toolData,
              input: toolData.input,
            });
          } else if (event === 'on_tool_end') {
            const toolData = data as ToolEventData;
            console.log('Tool End:', {
              tool: toolData.tool,
              output: toolData.output,
            });
          } else if (event === 'on_tool_error') {
            const toolData = data as ToolEventData;
            console.error('Tool Error:', {
              tool: toolData.tool,
              error: toolData.error,
            });
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
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
