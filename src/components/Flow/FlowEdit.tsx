import React, { useCallback, useState, useMemo, useEffect, memo } from 'react';
import styled from 'styled-components';
import ReactFlow, {
  Node,
  Edge,
  Background,
  NodeChange,
  applyNodeChanges,
  NodeTypes,
  MarkerType,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getLayoutedElements } from './util';
import { NodeModuleEdit } from './comps';
import { Course } from '@/lib/mongo/models/CourseModel';
import { isEqual } from 'lodash';

// Custom styling for ReactFlow elements
const FlowContainer = styled.div`
  width: 100%;
  height: 900px;
  min-height: 600px;
  max-height: 80vh;

  /* Hide attribution */
  .react-flow__attribution {
    display: none !important;
  }

  /* Style controls */
  .react-flow__controls {
    background-color: ${({ theme }) => (theme.scheme === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.8)')};
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    ${({ theme }) => (theme.scheme === 'dark' ? 'border: 1px solid rgba(245, 158, 11, 0.2);' : '')}
  }

  .react-flow__controls-button {
    background-color: ${({ theme }) => (theme.scheme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)')};
    border: none;
    color: ${({ theme }) => (theme.scheme === 'dark' ? '#f3f4f6' : '#333')};
    width: 24px;
    height: 24px;
    padding: 5px;
    margin: 2px;
    transition: all 0.2s ease;
    border-radius: 4px;
  }

  .react-flow__controls-button:hover {
    background-color: rgba(245, 158, 11, 0.2);
  }

  .react-flow__controls-button svg {
    fill: ${({ theme }) => (theme.scheme === 'dark' ? '#f3f4f6' : '#666')};
    width: 12px;
    height: 12px;
  }

  /* Additional styling for React Flow components */
  .react-flow__node {
    transition: box-shadow 0.2s ease, transform 0.1s ease;
  }

  .react-flow__node:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const createNodeFromModule = (
  module: Course['modules']['roadmap'][number],
  position: { x: number; y: number },
): Node => {
  return {
    id: module.id,
    type: 'nodeType',
    position,
    data: { module },
  };
};

// Apply dashed style to edges coming from optional nodes
const formatEdgesWithOptionalStyle = (edges: Edge[], nodes: Node[]): Edge[] => {
  // Create a map of node id to isRequired status
  const nodeRequiredMap: Record<string, boolean> = {};
  nodes.forEach((node) => {
    if (node.data?.module) {
      nodeRequiredMap[node.id] = node.data.module.isRequired;
    }
  });

  return edges.map((edge) => {
    const sourceRequired = nodeRequiredMap[edge.source];
    // If source node is optional (not required), make the edge dashed
    if (sourceRequired === false) {
      return {
        ...edge,
        style: {
          ...edge.style,
          strokeDasharray: '5, 5', // Creates a dashed line pattern
        },
      };
    }
    return edge;
  });
};

interface FlowProps {
  initialNodes: Course['modules']['roadmap'];
  edges: Edge[];
  onNodeClick?: (node: Course['modules']['roadmap'][number]) => void;
  showLessonsProgress: boolean;
}

const Flow: React.FC<FlowProps> = memo(({ initialNodes, edges, onNodeClick, showLessonsProgress }) => {
  const initialLayoutNodes = initialNodes.map((module) => createNodeFromModule(module, { x: 0, y: 0 }));
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialLayoutNodes,
    edges,
    'TB',
    showLessonsProgress,
  );
  const [nodes, setNodes] = useState<Node[]>(layoutedNodes);
  const [formattedEdges, setFormattedEdges] = useState(formatEdgesWithOptionalStyle(layoutedEdges, layoutedNodes));

  useEffect(() => {
    const { nodes: newLayoutedNodes, edges: newLayoutedEdges } = getLayoutedElements(
      initialNodes.map((module) => createNodeFromModule(module, { x: 0, y: 0 })),
      edges,
      'TB',
      showLessonsProgress,
    );
    setNodes(newLayoutedNodes);
    setFormattedEdges(formatEdgesWithOptionalStyle(newLayoutedEdges, newLayoutedNodes));
  }, [initialNodes, edges, showLessonsProgress]);

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      nodeType: (props) => <NodeModuleEdit {...props} showLessonsProgress={!!showLessonsProgress} />,
    }),
    [],
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes);
      setFormattedEdges(formatEdgesWithOptionalStyle(formattedEdges, updatedNodes));
    },
    [nodes, formattedEdges],
  );

  return (
    <FlowContainer>
      <ReactFlow
        nodes={nodes}
        edges={formattedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={handleNodesChange}
        onNodeClick={(event, node) => {
          if (onNodeClick) {
            onNodeClick(node.data.module);
          }
        }}
        connectOnClick={false}
        nodesDraggable={true}
        zoomOnScroll={true}
        fitView={true}
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: 'bezier',
          animated: false,
          style: {
            stroke: '#555',
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.Arrow,
            color: '#555',
          },
        }}
      >
        <Background />
        <Controls
          showInteractive={false}
          position="bottom-left"
          style={{
            bottom: 10,
            left: 10,
          }}
        />
      </ReactFlow>
    </FlowContainer>
  );
}, isEqual);

export default Flow;
