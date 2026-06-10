"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  GitBranch, 
  MessageSquare, 
  Code2, 
  Database,
  CheckCircle2,
  ChevronDown,
  Lock,
  Zap,
  Globe
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "ide" | "agents" | "workflows">("chat");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is GSMAXALL AI Operating System?",
      a: "GSMAXALL is a unified AI workstation that integrates conversational AI, a full-featured code editor (IDE), autonomous developer agents, a visual workflow automation builder, and document-based vector search (RAG) into a single, high-performance web interface."
    },
    {
      q: "How does the autonomous agent coding workspace work?",
      a: "Our agents work in a secure Docker sandbox environment. They can read and write files, run terminal commands, execute tests, and self-correct based on error outputs, similar to OpenHands or Cursor Composer."
    },
    {
      q: "Can I connect my own AI keys?",
      a: "Yes. In the workspace settings, you can securely configure and use your own keys for OpenAI, Anthropic, Gemini, DeepSeek, Grok, or connect to local Ollama models."
    },
    {
      q: "How does the visual workflow builder compare to n8n?",
      a: "Our workflow builder provides an n8n-style visual graph canvas. You can drag and drop nodes, define Webhook or Schedule triggers, connect AI Prompt actions, run Javascript mapping, and deploy automations seamlessly."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      {/* Background radial gradients for Vercel/Base44 look */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-800">
              <img src="https://www.gsgroups.net/gslogo.png" alt="GSMAXALL Logo" className="w-6 h-6 object-contain invert" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              GSMAXALL
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <a href="/features" className="hover:text-white transition-colors">Features</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/docs" className="hover:text-white transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </a>
            <a 
              href="/signup" 
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Introducing GSMAXALL v1.0.0 OS
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          The Ultimate Unified AI <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Operating System</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A premium production-ready ecosystem combining Open WebUI, OpenHands style developer agents, n8n-style workflow pipelines, and a Monaco code workspace. Built for elite teams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            Launch Free Workspace <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/docs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Terminal className="w-4 h-4" /> Read Documentation
          </a>
        </div>

        {/* Dynamic Demo Showcase */}
        <div className="max-w-5xl mx-auto border border-zinc-800 rounded-2xl bg-zinc-950/80 shadow-2xl shadow-indigo-500/5 overflow-hidden">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-900 bg-zinc-950">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
              <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
              <span className="text-xs text-zinc-500 font-mono ml-2">workspace://gsmaxall-system</span>
            </div>
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
              {(["chat", "ide", "agents", "workflows"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? "bg-zinc-800 text-white shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Demo Content Screens */}
          <div className="p-8 aspect-video flex flex-col justify-between text-left bg-[#050505] relative min-h-[400px]">
            {activeTab === "chat" && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">U</div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-300">
                      Can you write a vector search helper using Qdrant client and Anthropic Claude?
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">GS</div>
                    <div className="bg-zinc-900/60 border border-zinc-950 rounded-xl px-4 py-2.5 text-sm text-zinc-300 space-y-2 flex-1">
                      <p className="font-semibold text-zinc-200">Certainly! Let's instantiate Qdrant Client:</p>
                      <pre className="bg-black/60 p-3 rounded-lg border border-zinc-900 text-xs text-zinc-400 font-mono overflow-x-auto">
{`import { QdrantClient } from '@qdrant/js-client-rest';
const client = new QdrantClient({ url: 'http://localhost:6333' });`}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="border border-zinc-800 rounded-xl p-3 flex items-center bg-zinc-950/80 gap-3 mt-6">
                  <MessageSquare className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-500 flex-1">Ask GSMAXALL AI...</span>
                  <div className="px-2.5 py-1.5 rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300">
                    Ctrl + Enter
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ide" && (
              <div className="flex gap-4 h-full">
                {/* File explorer panel */}
                <div className="w-1/4 border-r border-zinc-900 pr-4 hidden sm:block">
                  <p className="text-xs uppercase font-mono tracking-widest text-zinc-600 mb-4">Workspace</p>
                  <div className="space-y-2 text-xs font-medium text-zinc-400 font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-300"><Code2 className="w-3.5 h-3.5" /> index.js</div>
                    <div className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5" /> schema.prisma</div>
                    <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> package.json</div>
                    <div className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Dockerfile</div>
                  </div>
                </div>
                {/* Editor container */}
                <div className="flex-1 flex flex-col justify-between font-mono text-xs">
                  <div className="bg-black/50 p-4 rounded-xl border border-zinc-900 flex-1 overflow-auto text-zinc-400">
                    <span className="text-zinc-600">1</span> <span className="text-violet-400">const</span> app = <span className="text-yellow-400">express</span>();<br />
                    <span className="text-zinc-600">2</span> app.<span className="text-blue-400">use</span>(<span className="text-yellow-400">cors</span>());<br />
                    <span className="text-zinc-600">3</span> <span className="text-green-500">// Initialize Socket.io</span><br />
                    <span className="text-zinc-600">4</span> <span className="text-violet-400">const</span> io = <span className="text-violet-400">new</span> <span className="text-yellow-400">Server</span>(server);
                  </div>
                  <div className="bg-black border border-zinc-900 p-2.5 rounded-lg flex items-center justify-between text-zinc-500 text-[10px] mt-4">
                    <span>Shell Terminal (running Node.js)</span>
                    <span className="text-green-500 animate-pulse">● Connected</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "agents" && (
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm">Developer Agent (OpenHands style)</span>
                    </div>
                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-mono">
                      Loop Active
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-mono text-zinc-400">
                    <div className="text-green-500 flex items-center gap-1.5">✓ [Step 1] Completed layout analysis.</div>
                    <div className="text-green-500 flex items-center gap-1.5">✓ [Step 2] Read package.json successfully.</div>
                    <div className="text-indigo-400 flex items-center gap-1.5 animate-pulse-slow">➜ [Step 3] Running compilation checks: "npm run build"...</div>
                  </div>
                </div>
                {/* Agent statistics card */}
                <div className="grid grid-cols-3 gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-900">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Tokens Consumed</span>
                    <p className="text-lg font-bold">14,284</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Cost Savings</span>
                    <p className="text-lg font-bold text-green-400">$3.82</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Status</span>
                    <p className="text-lg font-bold">Running</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "workflows" && (
              <div className="flex flex-col h-full justify-between relative">
                {/* Canvas grid simulator */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
                <div className="relative flex items-center justify-around w-full h-full">
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col items-center gap-1 shadow-md z-10">
                    <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">Trigger</span>
                    <span className="text-xs font-semibold">Webhook Received</span>
                  </div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-zinc-800 to-indigo-500" />
                  <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-lg flex flex-col items-center gap-1 shadow-md z-10">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">AI Agent</span>
                    <span className="text-xs font-semibold">Process Webhook Payload</span>
                  </div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-zinc-800" />
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col items-center gap-1 shadow-md z-10">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">Integration</span>
                    <span className="text-xs font-semibold">Send Slack Alert</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Core Operating Modules</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Everything you need to build, automate, and orchestrate AI applications in one seamless platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <MessageSquare className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dual-Mode Chat Shell</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Multi-model selection (GPT, Claude, Gemini, DeepSeek) with direct vector integration for instant knowledge queries.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <Code2 className="w-8 h-8 text-violet-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cloud IDE Workspace</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Monaco editor with terminal shell connection, git commit visual integration, and real-time project file watching.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <Cpu className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Autonomous Coding Agents</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              OpenHands style autonomous developer agents executing bash commands, editing code, running tests, and reporting progress.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <GitBranch className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">n8n Style Workflows</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Visual node-based canvas for orchestrating triggers, schedulers, API queries, and AI prompt loops with ease.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <Database className="w-8 h-8 text-yellow-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Knowledge Hub RAG</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Upload PDF and doc files to automatically chunk, embed, and index into Qdrant for semantic agent searching.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 transition-all">
            <Lock className="w-8 h-8 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Multi-tenant settings, secure Auth.js sign-in, API key isolation, and sandboxed shell execution boundaries.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Transparent, Fair Pricing</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Get started for free or connect your own API keys for unlimited workspace builds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono text-zinc-500 font-semibold tracking-wider">Free Starter</span>
              <p className="text-3xl font-bold mt-2">$0</p>
              <p className="text-xs text-zinc-500 mt-1">Free forever, no card required</p>
              <ul className="mt-8 space-y-3.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Basic AI Chat Interface</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Monaco IDE with Mock Shell</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 1 Sandbox Developer Agent</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Up to 50MB Qdrant RAG index</li>
              </ul>
            </div>
            <a href="/signup" className="w-full text-center py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-colors mt-8 block">
              Start Building
            </a>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-2xl border-2 border-indigo-600 bg-zinc-950 relative flex flex-col justify-between shadow-lg shadow-indigo-600/5">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </span>
            <div>
              <span className="text-xs uppercase font-mono text-zinc-400 font-semibold tracking-wider">Professional</span>
              <p className="text-3xl font-bold mt-2">$29 <span className="text-sm text-zinc-500 font-normal">/ mo</span></p>
              <p className="text-xs text-zinc-500 mt-1">Perfect for solo builders and devs</p>
              <ul className="mt-8 space-y-3.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Advanced Multi-Model AI Chat</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Full WebSocket Terminal Shell</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Unlimited Autonomous Agents</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Custom n8n Workflow Engines</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 2GB Vector DB RAG space</li>
              </ul>
            </div>
            <a href="/signup" className="w-full text-center py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors mt-8 block">
              Go Professional
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono text-zinc-500 font-semibold tracking-wider">Enterprise</span>
              <p className="text-3xl font-bold mt-2">Custom</p>
              <p className="text-xs text-zinc-500 mt-1">For scale production and security</p>
              <ul className="mt-8 space-y-3.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Sandboxed Isolated Containers</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Dedicated Vector DB Instances</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Single Sign-On (SSO / SAML)</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 99.9% Server SLA Guarantees</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 24/7 Priority Support SLAs</li>
              </ul>
            </div>
            <a href="mailto:sales@gsmaxall.ai" className="w-full text-center py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-colors mt-8 block">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-zinc-800 rounded-xl bg-zinc-950/40 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold hover:bg-zinc-900/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-sm text-zinc-400 border-t border-zinc-900/80 bg-zinc-950/20 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-12 text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center overflow-hidden">
              <img src="https://www.gsgroups.net/gslogo.png" alt="GSMAXALL Logo" className="w-4 h-4 object-contain invert" />
            </div>
            <span className="font-semibold text-zinc-300">GSMAXALL AI</span>
          </div>

          <div className="flex gap-8">
            <a href="/features" className="hover:text-white transition-colors">Features</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/docs" className="hover:text-white transition-colors">Docs</a>
          </div>

          <p className="text-xs">&copy; {new Date().getFullYear()} GSMAXALL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
