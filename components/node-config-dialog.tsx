'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { NodeData } from '@/lib/nodes';
import { useReactFlow } from '@xyflow/react';

interface NodeConfigDialogProps {
  open: boolean;
  onClose: () => void;
  nodeData: NodeData;
  nodeId: string;
}

export default function NodeConfigDialog({ open, onClose, nodeData, nodeId }: NodeConfigDialogProps) {
  const { setNodes } = useReactFlow();
  const [config, setConfig] = useState(nodeData.config || {});

  useEffect(() => {
    setConfig(nodeData.config || {});
  }, [nodeData.config]);

  const handleSave = () => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    );
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Configure {nodeData.label}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            {nodeData.nodeType === 'script' ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Video Topic</label>
                  <input
                    type="text"
                    value={config.topic || ''}
                    onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., How to build a React app"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={config.audience || ''}
                    onChange={(e) => setConfig({ ...config, audience: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., beginner developers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Video Length</label>
                  <select
                    value={config.length || 'medium'}
                    onChange={(e) => setConfig({ ...config, length: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="short">Short (5-8 min)</option>
                    <option value="medium">Medium (10-15 min)</option>
                    <option value="long">Long (20+ min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tone</label>
                  <input
                    type="text"
                    value={config.tone || ''}
                    onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., engaging and informative"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Video Title</label>
                  <input
                    type="text"
                    value={config.title || ''}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., Master React in 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Key Elements</label>
                  <textarea
                    value={config.keyElements || ''}
                    onChange={(e) => setConfig({ ...config, keyElements: e.target.value })}
                    className="w-full border rounded px-3 py-2 h-24"
                    placeholder="e.g., React logo, code snippets, happy developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Style</label>
                  <input
                    type="text"
                    value={config.style || ''}
                    onChange={(e) => setConfig({ ...config, style: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., bold and eye-catching, modern tech aesthetic"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
