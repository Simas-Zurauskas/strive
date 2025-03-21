'use server';
import { AIMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import { Annotation, MessagesAnnotation, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { model } from '@/lib/ai/models';
import { TOOLS } from './tools';

const ConfigurationSchema = Annotation.Root({
  systemPromptTemplate: Annotation<string>,
});

async function callModel(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig,
): Promise<typeof MessagesAnnotation.Update> {
  const modelWithTools = model.bindTools(TOOLS);
  console.log('node __callModel__');

  const response = await modelWithTools.invoke([...state.messages]);

  return { messages: [response] };
}

function routeModelOutput(state: typeof MessagesAnnotation.State): string {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  if ((lastMessage as AIMessage)?.tool_calls?.length || 0 > 0) {
    return 'tools';
  } else {
    return '__end__';
  }
}

const workflow = new StateGraph(MessagesAnnotation, ConfigurationSchema)
  .addNode('callModel', callModel)
  .addNode('tools', new ToolNode(TOOLS))
  .addEdge('__start__', 'callModel')
  .addConditionalEdges('callModel', routeModelOutput)
  .addEdge('tools', 'callModel');

export const toolCalling = async () => {
  const graph = workflow.compile();

  const result = await graph.invoke({
    messages: [
      {
        role: 'system',
        content: `You get a list of images urls. You need to use serper tool to get the verified direct image urls. Topic "Mastering Jungian Psychology: From Theory to Practice
Dive into the transformative world of Jungian psychology, where you'll explore the depths of archetypes, shadow work, and dream analysis. This course will guide you through the intricate process of individuation, equipping you with the skills to apply these concepts in therapeutic or coaching settings. By the end, you'll have a profound understanding of Jungian theory and its practical applications."`,
      },
    ],
  });
  console.log(result.messages.map((el) => el.content));
};
