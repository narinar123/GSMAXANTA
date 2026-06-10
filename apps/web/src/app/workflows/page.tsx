"use client";

import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { 
  GitBranch, 
  Play, 
  Save, 
  Plus, 
  Trash2, 
  Settings,
  Webhook, 
  Clock, 
  Bot, 
  MessageSquare, 
  Mail, 
  ChevronRight,
  Database,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "action";
  label: string;
  sublabel: string;
  icon: React.ComponentType<any>;
  color: string;
  x: number;
  y: number;
  status?: "idle" | "running" | "success" | "error";
  config?: Record<string, string>;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

const AVAILABLE_NODES = [
  // Triggers
  { id: "webhook-trigger", type: "trigger", label: "Webhook Trigger", sublabel: "HTTP POST Endpoint", icon: Webhook, color: "text-green-500 bg-green-500/10", config: { path: "/hooks/incoming" } },
  { id: "schedule-trigger", type: "trigger", label: "Schedule Trigger", sublabel: "Cron interval timer", icon: Clock, color: "text-blue-500 bg-blue-500/10", config: { cron: "*/5 * * * *" } },
  { id: "database-trigger", type: "trigger", label: "Database Event", sublabel: "Row inserts or updates", icon: Database, color: "text-yellow-500 bg-yellow-500/10", config: { table: "users" } },
  // Actions
  { id: "ai-prompt", type: "action", label: "AI Prompt Action", sublabel: "Compose LLM Completion", icon: Bot, color: "text-indigo-500 bg-indigo-500/10", config: { prompt: "Summarize this payload: {{payload}}" } },
  { id: "slack-action", type: "action", label: "Slack Webhook", sublabel: "Post text message to channel", icon: MessageSquare, color: "text-purple-500 bg-purple-500/10", config: { channel: "#alerts" } },
  { id: "email-action", type: "action", label: "Email Alert", sublabel: "Send SMTP mail payload", icon: Mail, color: "text-red-500 bg-red-500/10", config: { to: "team@gsmaxall.ai" } }
];

export default function WorkflowsPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: "node-trigger", type: "trigger", label: "Webhook Trigger", sublabel: "HTTP POST Endpoint", icon: Webhook, color: "text-green-500 bg-green-500/10", x: 100, y: 150, status: "idle", config: { path: "/hooks/incoming" } },
    { id: "node-ai", type: "action", label: "AI Prompt Action", sublabel: "Compose LLM Completion", icon: Bot, color: "text-indigo-500 bg-indigo-500/10", x: 350, y: 150, status: "idle", config: { prompt: "Summarize: {{payload}}" } },
    { id: "node-slack", type: "action", label: "Slack Alert", sublabel: "Post text message to channel", icon: MessageSquare, color: "text-purple-500 bg-purple-500/10", x: 600, y: 150, status: "idle", config: { channel: "#alerts" } }
  ]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([
    { id: "edge-1", source: "node-trigger", target: "node-ai" },
    { id: "edge-2", source: "node-ai", target: "node-slack" }
  ]);
  
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_RUNNER_WS_URL || "ws://localhost:3001";
    const socketIo = io(wsUrl);

    socketIo.on("connect", () => {
      console.log("WebSocket connected on Workflows workspace.");
    });

    socketIo.on("workflow:step", ({ nodeId, status, output }: { nodeId: string, status: any, output?: any }) => {
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status } : n));
      
      if (output) {
        console.log(`Node ${nodeId} output:`, output);
      }
    });

    socketIo.on("workflow:completed", () => {
      setIsExecuting(false);
      alert("Workflow execution completed successfully!");
    });

    socketIo.on("workflow:error", (err: { message: string }) => {
      setIsExecuting(false);
      alert(`Workflow execution error: ${err.message}`);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleStartWorkflow = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    // Reset status fields
    setNodes(prev => prev.map(n => ({ ...n, status: "idle" })));

    if (socket && socket.connected) {
      socket.emit("workflow:execute", { nodes, edges });
    } else {
      // Fallback local visual execution simulation
      simulateWorkflow();
    }
  };

  const simulateWorkflow = () => {
    let index = 0;
    const executionOrder = ["node-trigger", "node-ai", "node-slack"];

    const runStep = () => {
      if (index >= executionOrder.length) {
        setIsExecuting(false);
        return;
      }

      const activeId = executionOrder[index];
      // Mark active running
      setNodes(prev => prev.map(n => n.id === activeId ? { ...n, status: "running" } : n));

      setTimeout(() => {
        // Mark active success
        setNodes(prev => prev.map(n => n.id === activeId ? { ...n, status: "success" } : n));
        index++;
        runStep();
      }, 1800);
    };

    runStep();
  };

  // Node Dragging Handlers
  const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
    if (isExecuting) return;
    const node = nodes.find(n => n.id === id);
    if (!node) return;

    setDraggedNode(id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode) return;
    setNodes(prev => prev.map(n => 
      n.id === draggedNode 
        ? { ...n, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } 
        : n
    ));
  };

  const handleCanvasMouseUp = () => {
    setDraggedNode(null);
  };

  // Create node node triggers
  const handleAddNode = (template: typeof AVAILABLE_NODES[0]) => {
    const newId = `node-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newId,
      type: template.type as any,
      label: template.label,
      sublabel: template.sublabel,
      icon: template.icon,
      color: template.color,
      x: 200,
      y: 200,
      status: "idle",
      config: template.config ? { ...template.config } as unknown as Record<string, string> : {}
    };

    setNodes(prev => [...prev, newNode]);

    // Automatically link to last node if simple line structure
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      setEdges(prev => [...prev, {
        id: `edge-${Date.now()}`,
        source: lastNode.id,
        target: newId
      }]);
    }
  };

  // Delete node file
  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
    if (selectedNode?.id === id) {
      setSelectedNode(null);
    }
  };

  // Update Config details
  const handleConfigChange = (key: string, value: string) => {
    if (!selectedNode) return;
    const updated = {
      ...selectedNode,
      config: {
        ...selectedNode.config,
        [key]: value
      }
    };
    setSelectedNode(updated);
    setNodes(prev => prev.map(n => n.id === selectedNode.id ? updated : n));
  };

  return (
    <div className="flex h-full border-t border-border bg-background overflow-hidden select-none">
      {/* Node Catalog Left Drawer */}
      <aside className="w-64 border-r border-border bg-card/40 flex flex-col justify-between shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-border">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
              Workflow Nodes
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Triggers Category */}
            <div>
              <p className="text-[10px] uppercase font-mono text-zinc-500 mb-2.5 font-bold tracking-widest">Triggers</p>
              <div className="space-y-2">
                {AVAILABLE_NODES.filter(n => n.type === "trigger").map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAddNode(n)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-xs flex items-center gap-2.5"
                    >
                      <div className={`p-1.5 rounded ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{n.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.sublabel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Category */}
            <div>
              <p className="text-[10px] uppercase font-mono text-zinc-500 mb-2.5 font-bold tracking-widest">Actions</p>
              <div className="space-y-2">
                {AVAILABLE_NODES.filter(n => n.type === "action").map((n, i) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAddNode(n)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-border bg-card hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-xs flex items-center gap-2.5"
                    >
                      <div className={`p-1.5 rounded ${n.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{n.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{n.sublabel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Grid Canvas in the Center */}
      <div 
        className="flex-1 relative flex flex-col justify-between overflow-hidden bg-dot-grid"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {/* Canvas background Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Header toolbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-indigo-500" />
            <h1 className="font-semibold tracking-tight text-base">n8n Workflow Canvas</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold"
              onClick={() => alert("Workflow layout configuration saved to Postgres database.")}
            >
              <Save className="w-4 h-4" /> Save Graph
            </button>
            <button
              onClick={handleStartWorkflow}
              disabled={isExecuting}
              className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-indigo-600/10"
            >
              {isExecuting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Execute Pipeline
                </>
              )}
            </button>
          </div>
        </header>

        {/* SVG visual connector lines layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {edges.map((edge) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            // Connection coordinates from right handle of source to left handle of target
            const startX = sourceNode.x + 180;
            const startY = sourceNode.y + 35;
            const endX = targetNode.x;
            const endY = targetNode.y + 35;

            // Cubic bezier path layout
            const controlPointX = startX + 80;
            const d = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${endX - 80} ${endY}, ${endX} ${endY}`;

            return (
              <path
                key={edge.id}
                d={d}
                fill="none"
                stroke={sourceNode.status === "success" ? "#10b981" : sourceNode.status === "running" ? "#8b5cf6" : "#27272a"}
                strokeWidth={2}
                className="transition-colors duration-500"
              />
            );
          })}
        </svg>

        {/* Drag-and-drop Nodes layer */}
        <div className="flex-1 relative z-10 overflow-auto">
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onClick={() => setSelectedNode(node)}
                style={{ left: node.x, top: node.y }}
                className={`absolute w-[180px] p-3.5 rounded-xl border bg-card/90 shadow-md backdrop-blur-md cursor-grab active:cursor-grabbing node-card select-none z-10 transition-shadow ${
                  selectedNode?.id === node.id 
                    ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-lg" 
                    : node.status === "running"
                    ? "border-indigo-500 shadow-md"
                    : node.status === "success"
                    ? "border-green-500 shadow-md"
                    : "border-border"
                }`}
              >
                {/* Node Status Indicator dots */}
                <div className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center">
                  {node.status === "running" && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    node.status === "success" 
                      ? "bg-green-500" 
                      : node.status === "running" 
                      ? "bg-indigo-500" 
                      : "bg-zinc-700"
                  }`} />
                </div>

                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded shrink-0 ${node.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-foreground">{node.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{node.sublabel}</p>
                  </div>
                </div>

                {/* Connection handles points */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-border bg-background -translate-x-1" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-border bg-background translate-x-1" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Property Parameter Editor Sidebar Panel on the Right */}
      {selectedNode && (
        <aside className="w-80 border-l border-border bg-card/40 flex flex-col justify-between shrink-0">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground font-semibold">
                <Settings className="w-4 h-4" />
                <span>Node Parameters</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <p className="text-xs font-bold text-foreground">{selectedNode.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{selectedNode.sublabel}</p>
              </div>

              {/* Dynamic properties field list inputs */}
              <div className="space-y-4">
                {selectedNode.config && Object.keys(selectedNode.config).map((key) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={selectedNode.config?.[key] || ""}
                      onChange={(e) => handleConfigChange(key, e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-background border border-border rounded-lg focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <button
              onClick={() => handleDeleteNode(selectedNode.id)}
              className="w-full py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove Node Block
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
