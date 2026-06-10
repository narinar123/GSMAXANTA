"use client";

import React from "react";
import { ArrowLeft, MessageSquare, Code2, Cpu, GitBranch, Database, Shield } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500 font-sans relative">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back Home
          </a>
          <span className="font-semibold text-sm tracking-tight text-zinc-300">GSMAXALL FEATURES</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-1 w-full space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">Advanced AI Workspace Capabilities</h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Discover the modules that make GSMAXALL the most comprehensive workspace for AI developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <MessageSquare className="w-8 h-8 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Dual-Mode Chat Shell</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interact with state-of-the-art LLMs (GPT-4o, Claude 3.5 Sonnet, DeepSeek) while choosing to inject active vector database memories (RAG) or performing real-time web searches.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <Code2 className="w-8 h-8 text-violet-400" />
            <h3 className="text-lg font-semibold text-white">Monaco IDE Workspace</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Write, edit, and refactor code directly inside a Monaco-powered browser environment. Supports project file tree traversal, git integration panel, and direct workspace shell terminal logs.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <Cpu className="w-8 h-8 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Autonomous Developer Agents</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deploy OpenHands-style developer agent loops. These agents recursively write files, execute bash verification commands in a sandbox, review test outputs, and complete software engineering goals.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <GitBranch className="w-8 h-8 text-green-400" />
            <h3 className="text-lg font-semibold text-white">n8n Workflow Builders</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Drag-and-drop trigger and action node cards inside a visual grid SVG connector canvas. Automatically wire Webhooks or Cron schedulers to AI actions, and output results to Slack or emails.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <Database className="w-8 h-8 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Knowledge Hub RAG Registry</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Index PDF, Markdown, and text files. Under the hood, documents are parsed, chunked, embedded using vectorizers, and registered directly in Qdrant collections.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-950/40 space-y-4">
            <Shield className="w-8 h-8 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Docker Sandbox Boundaries</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your shell sessions, file edits, and agent executions are isolated safely within dedicated backend containers. Ensure full code execution safety during agent tasks.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} GSMAXALL AI OS. All rights reserved.
      </footer>
    </div>
  );
}
