"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Users, 
  Settings as SettingsIcon, 
  Server, 
  Cpu, 
  Database, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Play,
  RotateCw
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  tier: "FREE" | "PRO" | "ENTERPRISE";
  registered: string;
}

interface ServiceStatus {
  name: string;
  status: "active" | "error" | "restarting";
  port: string;
  cpu: string;
  memory: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: "usr-1", name: "Developer Alpha", email: "alpha@gsmaxall.ai", role: "ADMIN", tier: "ENTERPRISE", registered: "2026-06-01" },
    { id: "usr-2", name: "John Builder", email: "john@builder.io", role: "USER", tier: "PRO", registered: "2026-06-05" },
    { id: "usr-3", name: "Jane Coder", email: "jane@workspace.net", role: "USER", tier: "FREE", registered: "2026-06-08" }
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "Next.js App Frontend", status: "active", port: "3000", cpu: "1.2%", memory: "115 MB" },
    { name: "Node.js WebSocket Runner", status: "active", port: "3001", cpu: "0.8%", memory: "82 MB" },
    { name: "PostgreSQL Database", status: "active", port: "5432", cpu: "0.4%", memory: "45 MB" },
    { name: "Redis Cache Queue", status: "active", port: "6379", cpu: "0.2%", memory: "18 MB" },
    { name: "Qdrant Vector Database", status: "active", port: "6333", cpu: "1.5%", memory: "210 MB" }
  ]);

  const handleRestartService = (name: string) => {
    setServices(prev => prev.map(s => s.name === name ? { ...s, status: "restarting" } : s));
    
    setTimeout(() => {
      setServices(prev => prev.map(s => s.name === name ? { ...s, status: "active", cpu: "0.5%" } : s));
    }, 1500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-500" />
            System Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global service controls, active container limits, billing subscriptions, and user directories.
          </p>
        </div>
        
        <button
          onClick={() => {
            alert("Polling latest Docker stats...");
            setServices(prev => prev.map(s => ({ ...s, cpu: `${(Math.random() * 2).toFixed(1)}%` })));
          }}
          className="p-1 px-3 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold border border-border rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" /> REFRESH DOCKER
        </button>
      </div>

      {/* Services Grid (Docker containers states) */}
      <div className="space-y-4">
        <h3 className="font-semibold text-xs uppercase font-mono tracking-wider text-muted-foreground">
          Docker Container Microservices
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service) => (
            <div key={service.name} className="p-5 rounded-xl border border-border bg-card flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs font-bold truncate pr-3">{service.name}</p>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    service.status === "active" 
                      ? "bg-green-500 animate-pulse" 
                      : service.status === "restarting" 
                      ? "bg-yellow-500 animate-spin" 
                      : "bg-red-500"
                  }`} />
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-1">Port: {service.port}</p>
              </div>

              <div className="space-y-2 border-t border-border/60 pt-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">CPU:</span>
                  <span className="font-semibold">{service.cpu}</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">Memory:</span>
                  <span className="font-semibold">{service.memory}</span>
                </div>

                <button
                  onClick={() => handleRestartService(service.name)}
                  disabled={service.status === "restarting"}
                  className="w-full text-center py-1 mt-2 hover:bg-muted rounded border border-border text-[9px] uppercase font-mono tracking-widest text-muted-foreground hover:text-foreground transition-all"
                >
                  {service.status === "restarting" ? "Restarting..." : "Restart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Split User Directory & Usage Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* User Directory Table */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-xs uppercase font-mono tracking-wider text-muted-foreground">
              User Membership Directory
            </h3>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
              {users.length} Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2.5 font-semibold">User</th>
                  <th className="py-2.5 font-semibold">Role</th>
                  <th className="py-2.5 font-semibold">Subscription</th>
                  <th className="py-2.5 font-semibold">Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                    <td className="py-3">
                      <p className="font-bold">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${
                        user.role === "ADMIN" ? "bg-indigo-500/10 text-indigo-400" : "bg-muted text-muted-foreground"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-foreground">{user.tier}</span>
                    </td>
                    <td className="py-3 text-muted-foreground font-mono text-[10px]">
                      {user.registered}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global LLM Provider Analytics */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6">
          <h3 className="font-semibold text-xs uppercase font-mono tracking-wider text-muted-foreground">
            Provider Inference Statistics
          </h3>

          <div className="space-y-4">
            <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-semibold">Anthropic Claude</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                92ms avg latency
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold">OpenAI GPT-4o</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                145ms avg latency
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-semibold">Google Gemini</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                110ms avg latency
              </span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-background flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold">DeepSeek-V3</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                210ms avg latency
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
