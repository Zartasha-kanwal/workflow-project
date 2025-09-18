import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Minus,
  Maximize,
  Lock,
  Download,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Node {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  category: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

const FlowBuilder = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<Node | null>(null);
  const [zoom, setZoom] = useState(1);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const nodeTypes = {
    triggers: [
      {
        type: "trigger",
        title: "Trigger",
        description: "Start the flow",
        icon: "⚡",
      },
      {
        type: "webhook",
        title: "Webhook",
        description: "API trigger",
        icon: "🔗",
      },
    ],
    actions: [
      {
        type: "email",
        title: "Email",
        description: "Send an email",
        icon: "✉️",
      },
      {
        type: "sms",
        title: "SMS",
        description: "Send text message",
        icon: "💬",
      },
      { type: "task", title: "Task", description: "Create a task", icon: "✓" },
    ],
    logic: [
      {
        type: "condition",
        title: "Condition",
        description: "If/then logic",
        icon: "🔀",
      },
      { type: "delay", title: "Delay", description: "Wait period", icon: "⏱️" },
      {
        type: "split-test",
        title: "Split Test",
        description: "A/B testing",
        icon: "🧪",
      },
    ],
  };

  const handleDragStart = (nodeType: any, category: string) => {
    setDraggedNode({ ...nodeType, category, id: "", position: { x: 0, y: 0 } });
  };

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedNode || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      const newNode: Node = {
        ...draggedNode,
        id: `${draggedNode.type}-${Date.now()}`,
        position: { x, y },
      };

      setNodes((prev) => [...prev, newNode]);
      setDraggedNode(null);

      toast({
        title: "Node Added",
        description: `${newNode.title} added to workflow`,
      });
    },
    [draggedNode, zoom]
  );

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSaveFlow = () => {
    toast({
      title: "Flow Saved",
      description: "Your workflow has been saved successfully.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Flow Exported",
      description: "Workflow exported successfully.",
    });
  };

  const handleClear = () => {
    setNodes([]);
    setConnections([]);
    toast({
      title: "Canvas Cleared",
      description: "All nodes and connections removed.",
    });
  };

  const NodeComponent = ({ node }: { node: Node }) => {
    const getNodeStyle = () => {
      switch (node.category) {
        case "triggers":
          return "bg-green-600 text-white";
        case "actions":
          return "bg-blue-600 text-white";
        case "logic":
          return "bg-purple-600 text-white";
        default:
          return "bg-card text-foreground";
      }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      e.stopPropagation();
      setDraggingNodeId(node.id);
      setOffset({
        x: e.clientX - node.position.x,
        y: e.clientY - node.position.y,
      });
    };

    return (
      <div
        onMouseDown={handleMouseDown}
        className={`absolute border border-border rounded-lg p-4 shadow-sm cursor-move min-w-[120px] ${getNodeStyle()}`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${zoom})`,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{node.icon}</span>
          <h4 className="font-semibold text-sm">{node.title}</h4>
        </div>
        <p className="text-xs opacity-80">{node.description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/workflows")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-semibold">Flow Builder</span>
          </div>
          <h2 className="text-lg font-bold">New Marketing Flow</h2>
        </div>

        {/* Components */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Drag & Drop Components</h3>

          {/* Triggers */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              TRIGGERS
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Start your flows
            </p>
            {nodeTypes.triggers.map((trigger) => (
              <div
                key={trigger.type}
                draggable
                onDragStart={() => handleDragStart(trigger, "triggers")}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-grab active:cursor-grabbing mb-2"
              >
                <span className="text-lg">{trigger.icon}</span>
                <div>
                  <p className="font-medium text-sm">{trigger.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {trigger.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              ACTIONS
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Marketing actions
            </p>
            {nodeTypes.actions.map((action) => (
              <div
                key={action.type}
                draggable
                onDragStart={() => handleDragStart(action, "actions")}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-grab active:cursor-grabbing mb-2"
              >
                <span className="text-lg">{action.icon}</span>
                <div>
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Logic */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              LOGIC
            </h4>
            <p className="text-xs text-muted-foreground mb-3">Flow control</p>
            {nodeTypes.logic.map((logic) => (
              <div
                key={logic.type}
                draggable
                onDragStart={() => handleDragStart(logic, "logic")}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-grab active:cursor-grabbing mb-2"
              >
                <span className="text-lg">{logic.icon}</span>
                <div>
                  <p className="font-medium text-sm">{logic.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {logic.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button onClick={handleSaveFlow} className="w-full gap-2">
            <Download className="h-4 w-4" />
            Save Flow
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-foreground rounded-full"></div>
                <span>Nodes: {nodes.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <span>Connections: {connections.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={canvasRef}
            className="w-full h-full bg-accent/10 relative"
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseMove={(e) => {
              if (!draggingNodeId) return;
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === draggingNodeId
                    ? {
                        ...n,
                        position: {
                          x: e.clientX - offset.x,
                          y: e.clientY - offset.y,
                        },
                      }
                    : n
                )
              );
            }}
            onMouseUp={() => setDraggingNodeId(null)}
          >
            {nodes.map((node) => (
              <NodeComponent key={node.id} node={node} />
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute left-4 bottom-4 flex flex-col gap-1 bg-card border border-border rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
              className="rounded-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
              className="rounded-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(1)}
              className="rounded-none"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-none">
              <Lock className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
            React Flow
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowBuilder;
