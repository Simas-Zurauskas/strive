import { CompiledGraph } from '@langchain/langgraph';
import fs from 'fs';

export const printGraphImage = async (graph: CompiledGraph<any>, name?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('<PRINTING GRAPH>');
    graph
      .getGraphAsync({
        xray: true,
      })
      .then((graph) => {
        graph.drawMermaidPng().then(async (blob) => {
          const arrayBuffer = await blob.arrayBuffer();
          const buffer = new Uint8Array(arrayBuffer);
          fs.writeFileSync(`${name || 'graph'}.png`, buffer);
        });
      })
      .catch((err) => {
        console.error('Error in printGraphImage:', err);
      });
  }
};
