export type NodeType = 'script' | 'thumbnail';

export interface NodeData extends Record<string, unknown> {
  nodeType: NodeType;
  label: string;
  config: Record<string, any>;
}

export interface ScriptConfig {
  topic: string;
  audience?: string;
  length?: 'short' | 'medium' | 'long';
  tone?: string;
}

export interface ThumbnailConfig {
  title: string;
  keyElements?: string;
  style?: string;
}
