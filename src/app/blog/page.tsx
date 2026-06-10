"use client";

import React from "react";
import { ArrowLeft, BookOpen, Calendar, Clock } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "Orchestrating Autonomous Developer Loop Agents",
      summary: "Explore the internal architecture of OpenHands-style developer agent loops, command sandboxing, and runtime test feedback verification.",
      date: "June 8, 2026",
      readTime: "6 min read",
      category: "AI Engineering"
    },
    {
      title: "Deploying RAG pipelines using Qdrant REST APIs",
      summary: "A complete walkthrough on parsing documents, building cosine vector collections, and injecting indexed context into chat prompts.",
      date: "May 28, 2026",
      readTime: "4 min read",
      category: "Database"
    },
    {
      title: "Visual Workflow Builders for AI Pipelines",
      summary: "Why grid canvas graph layouts combined with webhook triggers are replacing traditional linear cron scripts for LLM automations.",
      date: "May 15, 2026",
      readTime: "8 min read",
      category: "Workflow"
    }
  ];

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
          <span className="font-semibold text-sm tracking-tight text-zinc-300">GSMAXALL BLOG</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex-1 w-full space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">Engineering Insights & Updates</h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Deep dives into visual workflows, vector retrievals, and autonomous code execution systems.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <article key={index} className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 transition-all space-y-4 cursor-pointer">
              <span className="text-[10px] uppercase font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-semibold">
                {post.category}
              </span>
              
              <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-xs text-zinc-400 leading-relaxed">
                {post.summary}
              </p>

              <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono pt-4 border-t border-zinc-900">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} GSMAXALL AI OS. All rights reserved.
      </footer>
    </div>
  );
}
