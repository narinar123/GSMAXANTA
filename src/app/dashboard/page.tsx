"use client";

import React from "react";
import { 
  TrendingUp, 
  MessageSquare, 
  Code2, 
  Cpu, 
  GitBranch, 
  Database,
  ArrowRight,
  Terminal,
  Activity,
  Layers
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Mock Data for charts
const tokenData = [
  { day: "Mon", Tokens: 12000 },
  { day: "Tue", Tokens: 19000 },
  { day: "Wed", Tokens: 32000 },
  { day: "Thu", Tokens: 24000 },
  { day: "Fri", Tokens: 45000 },
  { day: "Sat", Tokens: 18000 },
  { day: "Sun", Tokens: 29000 }
];

const modelDistribution = [
  { name: "Anthropic Claude", value: 45, color: "#8b5cf6" },
  { name: "OpenAI GPT-4", value: 30, color: "#3b82f6" },
  { name: "Gemini Pro", value: 15, color: "#ec4899" },
  { name: "DeepSeek-V3", value: 10, color: "#10b981" }
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Workspace Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics, resource status, and core modules navigation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-card px-3 py-1.5 rounded-lg border border-border">
          <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
          <span>RUNNER CONNECTED (LOCAL:3001)</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Active Agents</span>
            <p className="text-2xl font-bold mt-1">2 Running</p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Workflows Deployed</span>
            <p className="text-2xl font-bold mt-1">4 Active</p>
          </div>
          <div className="p-2.5 rounded-lg bg-green-500/10 text-green-500">
            <GitBranch className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Qdrant Vectors Indexed</span>
            <p className="text-2xl font-bold mt-1">1,492 Nodes</p>
          </div>
          <div className="p-2.5 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Daily API Calls</span>
            <p className="text-2xl font-bold mt-1">8,410 Requests</p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Usage Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold">Token Consumption Trends</h3>
              <p className="text-xs text-muted-foreground">Weekly cumulative inference token count</p>
            </div>
            <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
              Live updates
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenData}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#09090b", 
                    borderColor: "#1f1f23", 
                    color: "#f4f4f5",
                    fontSize: 12,
                    borderRadius: 8
                  }} 
                />
                <Area type="monotone" dataKey="Tokens" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Distribution */}
        <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-1">Model Distribution</h3>
            <p className="text-xs text-muted-foreground mb-6">Percentage allocation of requests</p>
            
            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {modelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "#09090b", 
                      borderColor: "#1f1f23", 
                      color: "#f4f4f5",
                      fontSize: 12,
                      borderRadius: 8
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {modelDistribution.map((model) => (
              <div key={model.name} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: model.color }} />
                  <span className="text-muted-foreground">{model.name}</span>
                </div>
                <span className="font-semibold">{model.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Executions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick modules list */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h3 className="font-semibold mb-4">Workspace Modules</h3>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="/chat" 
              className="p-4 rounded-lg border border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group flex flex-col gap-2"
            >
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-semibold">AI Assistant Chat</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-foreground">
                Launch Chat <ArrowRight className="w-3 h-3" />
              </span>
            </a>
            <a 
              href="/ide" 
              className="p-4 rounded-lg border border-border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all group flex flex-col gap-2"
            >
              <Code2 className="w-5 h-5 text-violet-500" />
              <span className="text-xs font-semibold">Monaco IDE Code</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-foreground">
                Open IDE <ArrowRight className="w-3 h-3" />
              </span>
            </a>
            <a 
              href="/agents" 
              className="p-4 rounded-lg border border-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group flex flex-col gap-2"
            >
              <Cpu className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-semibold">Autonomous Agents</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-foreground">
                Deploy Agent <ArrowRight className="w-3 h-3" />
              </span>
            </a>
            <a 
              href="/workflows" 
              className="p-4 rounded-lg border border-border hover:border-green-500/50 hover:bg-green-500/5 transition-all group flex flex-col gap-2"
            >
              <GitBranch className="w-5 h-5 text-green-500" />
              <span className="text-xs font-semibold">n8n Pipeline Flows</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-foreground">
                Build Flow <ArrowRight className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>

        {/* Real-time system console logs feed */}
        <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">System Runner Logs</h3>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                <Terminal className="w-3 h-3" /> STDOUT
              </div>
            </div>
            <div className="bg-black/60 p-4 rounded-lg border border-border/80 font-mono text-[11px] text-zinc-400 space-y-2.5 h-44 overflow-y-auto">
              <div>[SYSTEM] <span className="text-green-500">2026-06-10 05:22:16</span> Runner successfully initialized server process.</div>
              <div>[DB] <span className="text-zinc-500">2026-06-10 05:22:17</span> Prisma client connected to PostgreSQL container.</div>
              <div>[REDIS] <span className="text-zinc-500">2026-06-10 05:22:17</span> Redis pub/sub queue listener spawned.</div>
              <div>[QDRANT] <span className="text-zinc-500">2026-06-10 05:22:18</span> Vector registry collection initialized.</div>
              <div>[SOCKET] <span className="text-indigo-400">2026-06-10 05:24:02</span> New developer terminal connection established.</div>
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            Listening for execution feeds...
          </div>
        </div>
      </div>
    </div>
  );
}
