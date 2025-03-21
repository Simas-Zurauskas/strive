import dagre from 'dagre';
import { Node, Edge, MarkerType } from 'reactflow';

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB', showLessonsProgress = false) => {
  // Create a new dagre graph
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph options - TB means top-to-bottom layout
  const nodeWidth = 300;
  const nodeHeight = 150;

  // Calculate vertical spacing (ranksep) with 20% more if showLessonsProgress is true
  const baseRanksep = 100;
  const ranksep = showLessonsProgress ? baseRanksep * 1.3 : baseRanksep;

  // Set direction and node dimensions
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL', // Align to upper left
    nodesep: 100, // Increased horizontal separation between nodes at same rank
    ranksep, // Apply the calculated rank separation
    ranker: 'tight-tree', // Use tight tree algorithm for tighter packing
  });

  // Add nodes to the dagre graph with dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Create a map of nodes by rank (y-position) to help with randomization
  const nodesByRank: { [key: number]: Node[] } = {};

  // First pass: identify ranks
  nodes.forEach((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const rank = Math.round(dagreNode.y / 10) * 10; // Round to nearest 10 to group nodes at similar y positions

    if (!nodesByRank[rank]) {
      nodesByRank[rank] = [];
    }
    nodesByRank[rank].push(node);
  });

  // Apply calculated positions to nodes with natural randomness
  const layoutedNodes = nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);

    // Add human-like randomness
    // More horizontal randomness (doesn't affect hierarchy)
    const randomX = Math.random() * 60 - 30; // ±30px randomness

    // Very small vertical randomness (within safe bounds of its rank)
    // Use a smaller range for Y to ensure we don't cross rank boundaries
    const randomY = Math.random() * 20 - 10; // ±10px randomness

    // Create an uneven, more natural distribution (slight rightward bias)
    const naturalBias = Math.random() > 0.7 ? 15 : 0;

    // Position at center of node
    return {
      ...node,
      position: {
        x: dagreNode.x - nodeWidth / 2 + randomX + naturalBias,
        y: dagreNode.y - nodeHeight / 2 + randomY,
      },
    };
  });

  // Add natural curves to the edges for a more organic feel
  const layoutedEdges = edges.map((edge) => ({
    ...edge,
    type: 'bezier', // Use bezier curves for more pronounced curvature
    animated: false,
    style: {
      stroke: '#555',
      strokeWidth: 2,
    },
    markerEnd: {
      type: MarkerType.Arrow,
      color: '#555',
    },
  }));

  return {
    nodes: layoutedNodes,
    edges: layoutedEdges,
  };
};
