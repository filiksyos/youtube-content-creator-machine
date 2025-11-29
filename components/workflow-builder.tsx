'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import WorkflowNode from './workflow-node';
import ExecutionPanel from './execution-panel';
import { Plus } from 'lucide-react';
import { NodeData } from '@/lib/nodes';

const nodeTypes = {
  custom: WorkflowNode,
};

const initialNodes: Node<NodeData>[] = [];
const initialEdges: Edge[] = [];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [executionResults, setExecutionResults] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: 'script' | 'thumbnail') => {
    const newNode: Node<NodeData> = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      position: { x: 250, y: nodes.length * 100 + 50 },
      data: {
        nodeType: type,
        label: type === 'script' ? 'Script Generator' : 'Thumbnail Generator',
        config: {},
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const executeWorkflow = async () => {
    setIsExecuting(true);
    const results: any = {};

    try {
      for (const node of nodes) {
        if (node.data.nodeType === 'script') {
          const response = await fetch('/api/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(node.data.config),
          });
          const data = await response.json();
          results[node.id] = { type: 'script', data: data.script };
        } else if (node.data.nodeType === 'thumbnail') {
          const response = await fetch('/api/generate-thumbnail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(node.data.config),
          });
          const data = await response.json();
          results[node.id] = { type: 'thumbnail', data: data.imageUrl };
        }
      }
      setExecutionResults(results);
    } catch (error) {
      console.error('Workflow execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={() => addNode('script')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Script Node
          </button>
          <button
            onClick={() => addNode('thumbnail')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Thumbnail Node
          </button>
          <button
            onClick={executeWorkflow}
            disabled={isExecuting || nodes.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? 'Executing...' : 'Execute Workflow'}
          </button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      <ExecutionPanel results={executionResults} isExecuting={isExecuting} />
    </div>
  );
}
