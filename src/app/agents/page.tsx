"use client";

import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { 
  Cpu, 
  Play, 
  Square, 
  Terminal as TerminalIcon, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Code,
  Flame,
  Search,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface AgentStep {
  id: string;
  timestamp: string;
  status: "thinking" | "executing" | "verifying" | "completed";
  message: string;
  progress: number;
  logs: string;
}

const AGENT_TYPES = [
  { id: "developer", name: "Developer Agent (OpenHands)", description: "Autonomous developer writing files, running bash, fixing bugs.", icon: Code, color: "text-indigo-500 bg-indigo-500/10" },
  { id: "assistant", name: "Autonomous Assistant (OpenClaw)", description: "General automation engine with browser simulator and tools.", icon: Cpu, color: "text-violet-500 bg-violet-500/10" },
  { id: "researcher", name: "Research Agent", description: "Crawls documentation and web APIs to compile aggregated summaries.", icon: Search, color: "text-green-500 bg-green-500/10" },
  { id: "content", name: "Content Planner", description: "Drafts blogs, newsletters, and email copies using RAG guidelines.", icon: BookOpen, color: "text-yellow-500 bg-yellow-500/10" }
];

export default function AgentsPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("developer");
  const [taskPrompt, setTaskPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  
  // Code Diff viewer mock state
  const [showDiff, setShowDiff] = useState(false);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_RUNNER_WS_URL || "ws://localhost:3001";
    const socketIo = io(wsUrl);

    socketIo.on("connect", () => {
      console.log("WebSocket connected on Agents workspace.");
    });

    socketIo.on("agent:step", (step: AgentStep) => {
      setAgentSteps(prev => {
        // Prevent duplicate steps
        if (prev.find(s => s.id === step.id)) return prev;
        return [...prev, step];
      });
      setCurrentProgress(step.progress);
      setConsoleLogs(prev => [...prev, step.logs]);

      if (step.status === "completed") {
        setIsRunning(false);
        setShowDiff(true);
      }
    });

    socketIo.on("agent:stopped", () => {
      setIsRunning(false);
      setConsoleLogs(prev => [...prev, "[SYSTEM] Agent execution aborted by user."]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handleStartAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskPrompt.trim()) return;

    setIsRunning(true);
    setCurrentProgress(0);
    setAgentSteps([]);
    setShowDiff(false);
    setConsoleLogs([
      `[SYSTEM] Spawned Autonomous Agent process: ${selectedAgent.toUpperCase()}`,
      `[SYSTEM] Dispatched Goal Prompt: "${taskPrompt}"`
    ]);

    if (socket && socket.connected) {
      socket.emit("agent:start", { task: taskPrompt, agentType: selectedAgent });
    } else {
      // Fallback local simulation
      simulateAgentSteps();
    }
  };

  const handleStopAgent = () => {
    if (socket && socket.connected) {
      socket.emit("agent:stop");
    } else {
      setIsRunning(false);
      setConsoleLogs(prev => [...prev, "[SYSTEM Sandbox] Agent execution aborted."]);
    }
  };

  // Fallback simulation loop
  const simulateAgentSteps = () => {
    let currentStep = 0;
    const mockSteps = [
      { id: "s1", status: "thinking", message: "Analyzing project architecture & config files...", progress: 15 },
      { id: "s2", status: "thinking", message: "Searching codebase directories for target functions...", progress: 35 },
      { id: "s3", status: "executing", message: "Modifying local files to implement required methods...", progress: 60 },
      { id: "s4", status: "verifying", message: "Running local build and lint validation checks...", progress: 85 },
      { id: "s5", status: "completed", message: "Goal achieved! Files written and compiled successfully.", progress: 100 }
    ];

    const timer = setInterval(() => {
      if (currentStep >= mockSteps.length) {
        clearInterval(timer);
        setIsRunning(false);
        setShowDiff(true);
        return;
      }

      const active = mockSteps[currentStep];
      const stepObj: AgentStep = {
        id: active.id,
        timestamp: new Date().toISOString(),
        status: active.status as any,
        message: active.message,
        progress: active.progress,
        logs: `[AGENT_LOG ${new Date().toLocaleTimeString()}] Status: ${active.status.toUpperCase()} - ${active.message}`
      };

      setAgentSteps(prev => [...prev, stepObj]);
      setCurrentProgress(active.progress);
      setConsoleLogs(prev => [...prev, stepObj.logs]);

      currentStep++;
    }, 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto h-full flex flex-col justify-between">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Cpu className="w-6 h-6 text-indigo-500 animate-pulse" />
          Autonomous Agents Console
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Deploy OpenHands and OpenClaw developer agent loops to write files, research APIs, and run automations.
        </p>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Config & Launch */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4 text-sm uppercase font-mono tracking-wider text-muted-foreground">
              Select Agent Archetype
            </h3>
            <div className="space-y-3">
              {AGENT_TYPES.map((agent) => {
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    disabled={isRunning}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all flex items-start gap-3 ${
                      selectedAgent === agent.id
                        ? "border-indigo-500 bg-indigo-500/5 shadow-sm"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${agent.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{agent.name}</p>
                      <p className="text-muted-foreground mt-1 leading-relaxed">{agent.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal Input form */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-4 text-sm uppercase font-mono tracking-wider text-muted-foreground">
              Configure Agent Goal
            </h3>
            <form onSubmit={handleStartAgent} className="space-y-4">
              <textarea
                value={taskPrompt}
                onChange={(e) => setTaskPrompt(e.target.value)}
                disabled={isRunning}
                placeholder="Instruct the agent on what to achieve (e.g. 'Write a utility method in index.js to greet users')"
                rows={4}
                className="w-full text-xs p-3 bg-background border border-border rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />

              {!isRunning ? (
                <button
                  type="submit"
                  disabled={!taskPrompt.trim()}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/10"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Deploy Autonomous Loop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopAgent}
                  className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Terminate Exec Loop
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Steps & Logs terminal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Banner */}
          {isRunning && (
            <div className="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 space-y-3 animate-pulse-slow">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running autonomous loop steps...
                </span>
                <span className="font-semibold text-indigo-400">{currentProgress}%</span>
              </div>
              <div className="w-full bg-border/40 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-500" 
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Execution steps sequence */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h3 className="font-semibold text-sm uppercase font-mono tracking-wider text-muted-foreground">
              Execution Trace Loop
            </h3>
            {agentSteps.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-muted/10">
                Deploy an agent loop to view active logs.
              </div>
            ) : (
              <div className="space-y-4">
                {agentSteps.map((step) => (
                  <div key={step.id} className="flex gap-3">
                    <div className="mt-0.5 shrink-0">
                      {step.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center animate-ping" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">{step.message}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {step.status.toUpperCase()} &bull; {new Date(step.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workspace Diffs Panel */}
          {showDiff && (
            <div className="p-6 rounded-xl border border-green-500/20 bg-green-500/5 space-y-4">
              <h3 className="font-semibold text-sm uppercase font-mono tracking-wider text-green-500 flex items-center gap-1.5">
                <Code className="w-4 h-4" /> Workspace Diff Revisions
              </h3>
              <div className="bg-[#09090b] rounded-lg border border-zinc-900 font-mono text-[11px] p-4 text-zinc-300 overflow-x-auto space-y-1.5">
                <div className="text-zinc-500">diff --git a/index.js b/index.js</div>
                <div className="text-zinc-500">index e2a74c3..19a9301 100644</div>
                <div className="text-red-500">{"- module.exports = { calculateSum };"}</div>
                <div className="text-green-500">{"+ // Added by Agent"}</div>
                <div className="text-green-500">{"+ function greetUser(name) {"}</div>
                <div className="text-green-500">{"+   return `Hello, \${name}! Ready to code?`;"}</div>
                <div className="text-green-500">{"+ }"}</div>
                <div className="text-green-500">{"+ "}</div>
                <div className="text-green-500">{"+ module.exports = { calculateSum, greetUser };"}</div>
              </div>
            </div>
          )}

          {/* Raw terminal stdout stdout stream logs */}
          <div className="p-6 rounded-xl border border-border bg-card flex flex-col">
            <div className="flex items-center gap-1.5 mb-4 text-xs font-mono text-muted-foreground">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Raw Agent Shell Stream Output</span>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-border font-mono text-[11px] text-zinc-400 h-44 overflow-y-auto space-y-2">
              {consoleLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
