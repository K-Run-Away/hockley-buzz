import { Handle, Position } from 'reactflow';

interface CustomNodeProps {
  data: {
    label: string;
  };
}

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
} 