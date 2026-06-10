"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingPage() {
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
          <span className="font-semibold text-sm tracking-tight text-zinc-300">GSMAXALL PRICING</span>
        </div>
      </header>

      {/* Main pricing grid content */}
      <main className="max-w-5xl mx-auto px-6 py-20 flex-1 w-full space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">Choose Your Workspace Tier</h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Scale your autonomous agents, workflow blocks, and Monaco workspaces as your development needs grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold tracking-wider">Free Starter</span>
              <p className="text-3xl font-bold mt-2">$0</p>
              <p className="text-xs text-zinc-500 mt-1">Free forever, no card required</p>
              <ul className="mt-8 space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Basic AI Chat Interface</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Monaco IDE with Mock Shell</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 1 Sandbox Developer Agent</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Up to 50MB Qdrant RAG index</li>
              </ul>
            </div>
            <a href="/signup" className="w-full text-center py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors mt-8 block">
              Start Building
            </a>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-2xl border-2 border-indigo-600 bg-zinc-950 relative flex flex-col justify-between shadow-lg shadow-indigo-600/5">
            <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider">Professional</span>
              <p className="text-3xl font-bold mt-2">$29 <span className="text-sm text-zinc-500 font-normal">/ mo</span></p>
              <p className="text-xs text-zinc-500 mt-1">Perfect for solo builders and devs</p>
              <ul className="mt-8 space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Advanced Multi-Model AI Chat</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Full WebSocket Terminal Shell</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Unlimited Autonomous Agents</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Custom n8n Workflow Engines</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 2GB Vector DB RAG space</li>
              </ul>
            </div>
            <a href="/signup" className="w-full text-center py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors mt-8 block">
              Go Professional
            </a>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold tracking-wider">Enterprise</span>
              <p className="text-3xl font-bold mt-2">Custom</p>
              <p className="text-xs text-zinc-500 mt-1">For scale production and security</p>
              <ul className="mt-8 space-y-3.5 text-xs text-zinc-400">
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Sandboxed Isolated Containers</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Dedicated Vector DB Instances</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Single Sign-On (SSO / SAML)</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 99.9% Server SLA Guarantees</li>
                <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> 24/7 Priority Support SLAs</li>
              </ul>
            </div>
            <a href="mailto:sales@gsmaxall.ai" className="w-full text-center py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors mt-8 block">
              Contact Sales
            </a>
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
