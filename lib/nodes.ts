export type NodeType = 'script' | 'thumbnail';

export interface NodeData {
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
