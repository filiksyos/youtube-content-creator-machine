'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Settings } from 'lucide-react';
import NodeConfigDialog from './node-config-dialog';
import { NodeData } from '@/lib/nodes';

function WorkflowNode({ data, id }: NodeProps<NodeData>) {
  const [showConfig, setShowConfig] = useState(false);

  const bgColor = data.nodeType === 'script' ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <>
      <div className={`${bgColor} rounded-lg shadow-lg p-4 min-w-[200px] border-2 border-white`}>
        <Handle type="target" position={Position.Top} />
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-semibold">{data.label}</div>
          <button
            onClick={() => setShowConfig(true)}
            className="text-white hover:bg-white/20 p-1 rounded"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        <div className="text-white/80 text-xs">
          {data.nodeType === 'script' ? 'Generates YouTube scripts' : 'Creates 16:9 thumbnails'}
        </div>
        <Handle type="source" position={Position.Bottom} />
      </div>
      <NodeConfigDialog
        open={showConfig}
        onClose={() => setShowConfig(false)}
        nodeData={data}
        nodeId={id}
      />
    </>
  );
}

export default memo(WorkflowNode);
