"use client";

import React, { useState } from "react";
import { ArrowLeft, BookOpen, Terminal, Code, Cpu, GitBranch, Database, Shield } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 font-sans relative">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/40 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </a>
          <span className="font-semibold text-sm tracking-tight text-zinc-300">GSMAXALL DOCUMENTATION</span>
        </div>
      </header>

      {/* Main split docs layout */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-1 space-y-6">
          <div>
            <p className="text-[10px] uppercase font-mono text-zinc-500 mb-2.5 font-bold tracking-widest">Getting Started</p>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveSection("intro")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "intro" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Introduction
              </button>
              <button
                onClick={() => setActiveSection("docker")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "docker" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Docker Deployments
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-mono text-zinc-500 mb-2.5 font-bold tracking-widest">Core Workspace</p>
            <div className="space-y-1.5">
              <button
                onClick={() => setActiveSection("chat")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "chat" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                AI Completion Chat
              </button>
              <button
                onClick={() => setActiveSection("ide")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "ide" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Monaco Editor & Shell
              </button>
              <button
                onClick={() => setActiveSection("agents")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "agents" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Autonomous Agents
              </button>
              <button
                onClick={() => setActiveSection("workflows")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-semibold block transition-colors ${
                  activeSection === "workflows" ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                Workflow Automation
              </button>
            </div>
          </div>
        </aside>

        {/* Guides Content Area */}
        <main className="md:col-span-3 prose dark:prose-invert max-w-none text-zinc-300 space-y-8 bg-zinc-950/20 p-8 rounded-xl border border-zinc-900">
          {activeSection === "intro" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Introduction to GSMAXALL
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                GSMAXALL is a state-of-the-art AI Operating System designed to streamline development, automation, and RAG architectures.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                By grouping chat completions, file exploring, Monaco code editors, WebSocket terminals, and visual n8n workflow canvas connectors under a single workspace, we eliminate tool context shifting for engineers.
              </p>
              <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 space-y-2">
                <p className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">Workspace Requirements</p>
                <ul className="list-disc pl-4 text-xs text-zinc-400 space-y-1">
                  <li>Node.js v20 or higher</li>
                  <li>Docker and Docker Compose</li>
                  <li>PostgreSQL database instances</li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === "docker" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" /> Docker Deployment Guide
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We provide pre-configured Docker configurations to boot all workspace components (PostgreSQL, Redis, Qdrant, WebSocket Runner, and Next.js Frontend) concurrently.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white">1. Configure environment variables:</p>
                <p className="text-xs text-zinc-400">Copy the template configurations file:</p>
                <pre className="bg-[#09090b] p-3 rounded border border-zinc-900 text-[10px] font-mono text-zinc-400">
                  cp .env.example .env
                </pre>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-white">2. Launch Docker containers:</p>
                <pre className="bg-[#09090b] p-3 rounded border border-zinc-900 text-[10px] font-mono text-zinc-400">
                  docker-compose up --build -d
                </pre>
              </div>
            </div>
          )}

          {activeSection === "chat" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" /> AI Completion Chat
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The Chat interface integrates with OpenAI, Anthropic, Gemini, DeepSeek, and Grok. When RAG mode is active, the chat parses user prompts, queries the Qdrant database to retrieve semantic context chunks, and embeds the documentation directly inside the LLM prompt.
              </p>
            </div>
          )}

          {activeSection === "ide" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-400" /> Monaco Editor & Terminals
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The IDE workspace provides an autocomplete editor, file explorers, and terminals. Terminals communicate with the backend Socket.io runner process to execute commands securely inside a Docker workspace shell.
              </p>
            </div>
          )}

          {activeSection === "agents" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" /> Autonomous Developer Agents
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Autonomous agents are modeled on OpenHands loops. Upon receiving a goal (e.g. "Create database indexes"), the agent starts a recursive loop: planning the step, editing codebase files, running terminal tests, and verifying compilation.
              </p>
            </div>
          )}

          {activeSection === "workflows" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" /> n8n Workflow Automations
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Workflows represent node graphs. You define Trigger nodes (Webhooks, crons) linked to Action nodes (AI prompts, Email smtp). The backend pipeline engine runs active graphs sequentially, checking node states in real-time.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} GSMAXALL AI OS. All rights reserved.
      </footer>
    </div>
  );
}
