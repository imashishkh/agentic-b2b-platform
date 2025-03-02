import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DependencyGraphProps {
  dependencyGraph: {
    nodes: Array<{
      id: string;
      label: string;
      category: string;
      priority: string;
      parentId?: string;
    }>;
    edges: Array<{
      source: string;
      target: string;
      type: string;
    }>;
  };
}

export function DependencyGraph({ dependencyGraph }: DependencyGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get color based on category
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'frontend': return '#3b82f6'; // blue
      case 'backend': return '#10b981'; // green
      case 'database': return '#8b5cf6'; // purple
      case 'devops': return '#f59e0b'; // amber
      case 'ux': return '#ec4899'; // pink
      default: return '#6b7280'; // gray
    }
  };
  
  // Get color based on priority
  const getPriorityColor = (priority: string): string => {
    switch (priority.toLowerCase()) {
      case 'high': return '#ef4444'; // red
      case 'medium': return '#f59e0b'; // amber
      case 'low': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };
  
  // Draw the dependency graph
  useEffect(() => {
    if (!canvasRef.current || !dependencyGraph) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Position nodes using a simple force-directed layout
    const nodes = dependencyGraph.nodes.map(node => ({
      ...node,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 30
    }));
    
    // Simple force-directed layout simulation
    const simulation = () => {
      // Repulsive force between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 1 / distance * 50;
          
          if (distance < 100) {
            nodes[i].x -= dx * force / 10;
            nodes[i].y -= dy * force / 10;
            nodes[j].x += dx * force / 10;
            nodes[j].y += dy * force / 10;
          }
        }
      }
      
      // Attractive force for connected nodes
      for (const edge of dependencyGraph.edges) {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        
        if (source && target) {
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = distance / 30;
          
          source.x += dx * force / 50;
          source.y += dy * force / 50;
          target.x -= dx * force / 50;
          target.y -= dy * force / 50;
        }
      }
      
      // Keep nodes within canvas bounds
      for (const node of nodes) {
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
      }
    };
    
    // Run simulation steps
    for (let i = 0; i < 100; i++) {
      simulation();
    }
    
    // Draw edges
    ctx.lineWidth = 2;
    for (const edge of dependencyGraph.edges) {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        
        if (edge.type === 'dependency') {
          ctx.strokeStyle = '#ef4444'; // Red for dependencies
          ctx.setLineDash([5, 3]);
        } else {
          ctx.strokeStyle = '#9ca3af'; // Gray for parent-child
          ctx.setLineDash([]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw arrow for dependencies
        if (edge.type === 'dependency') {
          const angle = Math.atan2(target.y - source.y, target.x - source.x);
          const arrowSize = 8;
          
          const arrowX = target.x - target.radius * Math.cos(angle);
          const arrowY = target.y - target.radius * Math.sin(angle);
          
          ctx.beginPath();
          ctx.moveTo(arrowX, arrowY);
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
            arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        }
      }
    }
    
    // Draw nodes
    for (const node of nodes) {
      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = getCategoryColor(node.category);
      ctx.fill();
      
      // Draw priority indicator
      ctx.beginPath();
      ctx.arc(node.x + node.radius - 10, node.y - node.radius + 10, 7, 0, Math.PI * 2);
      ctx.fillStyle = getPriorityColor(node.priority);
      ctx.fill();
      
      // Draw label
      ctx.font = '10px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text if needed
      const maxWidth = node.radius * 1.5;
      let words = node.label.split(' ');
      let line = '';
      let lines = [];
      let y = node.y - 5;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && i > 0) {
          lines.push(line);
          line = words[i] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      // Limit to 2 lines and add ellipsis if needed
      if (lines.length > 2) {
        lines = lines.slice(0, 2);
        lines[1] = lines[1].substring(0, lines[1].length - 4) + '...';
      }
      
      // Draw each line
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], node.x, y + i * 12);
      }
      
      // Draw id (for debugging)
      // ctx.font = '8px Arial';
      // ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      // ctx.fillText(node.id, node.x, node.y + 15);
    }
    
  }, [dependencyGraph]);
  
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Task Dependency Graph</CardTitle>
      </CardHeader>
      <CardContent>
        {dependencyGraph && dependencyGraph.nodes.length > 0 ? (
          <div className="w-full h-96 relative">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
            />
            
            <div className="absolute bottom-2 right-2 bg-white p-2 rounded-md shadow-sm text-xs">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Frontend</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Backend</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                  <span>Database</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>DevOps</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-pink-500"></span>
                  <span>UX</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  <span>Low Priority</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-slate-50 rounded-md">
            <p className="text-slate-500 text-sm">No dependency data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
