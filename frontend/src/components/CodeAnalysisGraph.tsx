/**
 * Code Analysis Graph Component
 * Visualizes code analysis results with interactive graph
 */
import React, { useEffect, useRef, useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: 'file' | 'function' | 'vulnerability' | 'dependency';
  risk: 'low' | 'medium' | 'high' | 'critical';
  x?: number;
  y?: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: 'import' | 'call' | 'dependency';
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

interface CodeAnalysisGraphProps {
  width?: number;
  height?: number;
  data?: GraphData;
}

export const CodeAnalysisGraph: React.FC<CodeAnalysisGraphProps> = ({
  width = 400,
  height = 300,
  data
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Default sample data if none provided
  const defaultData = {
    nodes: [
      { id: 'main', label: 'main.js', type: 'file', risk: 'low' },
      { id: 'auth', label: 'auth.js', type: 'file', risk: 'high' },
      { id: 'db', label: 'database.js', type: 'file', risk: 'medium' },
      { id: 'api', label: 'api.js', type: 'file', risk: 'low' },
      { id: 'vuln1', label: 'SQL Injection', type: 'vulnerability', risk: 'critical' },
      { id: 'vuln2', label: 'XSS Risk', type: 'vulnerability', risk: 'high' },
    ],
    edges: [
      { from: 'main', to: 'auth', type: 'import' },
      { from: 'main', to: 'db', type: 'import' },
      { from: 'main', to: 'api', type: 'import' },
      { from: 'auth', to: 'vuln1', type: 'dependency' },
      { from: 'api', to: 'vuln2', type: 'dependency' },
    ]
  };

  const graphData = data || defaultData;

  // Color mapping for risk levels
  const riskColors = {
    low: '#22c55e',      // green
    medium: '#eab308',   // yellow
    high: '#f97316',     // orange
    critical: '#ef4444'  // red
  };

  // Type shapes available for future use
  // const typeShapes = {
  //   file: 'circle',
  //   function: 'square',
  //   vulnerability: 'diamond',
  //   dependency: 'hexagon'
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Calculate node positions (force-directed layout simulation)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    graphData.nodes.forEach((node: GraphNode, i: number) => {
      const angle = (i / graphData.nodes.length) * Math.PI * 2;
      node.x = centerX + Math.cos(angle) * radius;
      node.y = centerY + Math.sin(angle) * radius;
    });

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw edges first (behind nodes)
      graphData.edges.forEach((edge: GraphEdge) => {
        const fromNode = graphData.nodes.find((n: GraphNode) => n.id === edge.from);
        const toNode = graphData.nodes.find((n: GraphNode) => n.id === edge.to);
        
        if (fromNode && toNode && fromNode.x !== undefined && fromNode.y !== undefined && 
            toNode.x !== undefined && toNode.y !== undefined) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          
          // Arrow styling
          ctx.strokeStyle = edge.type === 'dependency' ? '#ef4444' : '#3b82f6';
          ctx.lineWidth = edge.type === 'dependency' ? 2 : 1;
          ctx.setLineDash(edge.type === 'dependency' ? [5, 5] : []);
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
          const arrowLength = 10;
          const arrowAngle = Math.PI / 6;

          ctx.beginPath();
          ctx.moveTo(toNode.x, toNode.y);
          ctx.lineTo(
            toNode.x - arrowLength * Math.cos(angle - arrowAngle),
            toNode.y - arrowLength * Math.sin(angle - arrowAngle)
          );
          ctx.lineTo(
            toNode.x - arrowLength * Math.cos(angle + arrowAngle),
            toNode.y - arrowLength * Math.sin(angle + arrowAngle)
          );
          ctx.closePath();
          ctx.fillStyle = edge.type === 'dependency' ? '#ef4444' : '#3b82f6';
          ctx.fill();
        }
      });

      // Draw nodes
      graphData.nodes.forEach((node: GraphNode) => {
        if (node.x === undefined || node.y === undefined) return;

        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        const nodeSize = isSelected ? 18 : isHovered ? 16 : 14;
        const color = riskColors[node.risk as keyof typeof riskColors];
        const glowSize = isSelected ? 20 : isHovered ? 15 : 10;

        // Glow effect
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = color;
        
        // Draw node shape
        ctx.fillStyle = color;
        ctx.strokeStyle = isSelected ? '#fff' : color;
        ctx.lineWidth = isSelected ? 3 : 2;

        ctx.beginPath();
        if (node.type === 'vulnerability') {
          // Diamond shape for vulnerabilities
          ctx.moveTo(node.x, node.y - nodeSize);
          ctx.lineTo(node.x + nodeSize, node.y);
          ctx.lineTo(node.x, node.y + nodeSize);
          ctx.lineTo(node.x - nodeSize, node.y);
        } else {
          // Circle for files
          ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Draw label
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, node.x, node.y + nodeSize + 5);
      });
    };

    draw();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if hovering over a node
      let found = false;
      graphData.nodes.forEach((node: GraphNode) => {
        if (node.x !== undefined && node.y !== undefined) {
          const dist = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
          if (dist < 20) {
            setHoveredNode(node.id);
            canvas.style.cursor = 'pointer';
            found = true;
          }
        }
      });
      
      if (!found) {
        setHoveredNode(null);
        canvas.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      graphData.nodes.forEach((node: GraphNode) => {
        if (node.x !== undefined && node.y !== undefined) {
          const dist = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2));
          if (dist < 20) {
            setSelectedNode(selectedNode === node.id ? null : node.id);
          }
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [graphData, width, height, selectedNode, hoveredNode]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-white/10 rounded-lg bg-black/40"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex flex-wrap gap-3 text-[8px] font-mono">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-400">Low Risk</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-gray-400">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rotate-45 bg-red-500" />
          <span className="text-gray-400">Critical</span>
        </div>
      </div>

      {/* Selected node info */}
      {selectedNode && (() => {
        const selected = graphData.nodes.find((n: GraphNode) => n.id === selectedNode);
        return selected ? (
          <div className="absolute top-2 right-2 bg-black/80 border border-white/20 rounded-lg p-3 text-xs font-mono max-w-[200px]">
            <div className="text-white font-bold mb-1">
              {selected.label}
            </div>
            <div className="text-gray-400 text-[10px]">
              Type: {selected.type}
            </div>
            <div className="text-gray-400 text-[10px]">
              Risk: {selected.risk.toUpperCase()}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
};

