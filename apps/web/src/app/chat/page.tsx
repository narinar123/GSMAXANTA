"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  Search, 
  Brain, 
  Globe, 
  Database,
  Sparkles,
  Bot,
  User,
  Trash2,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: string;
  timestamp: string;
  attachments?: string[];
}

const MODELS = [
  { id: "gpt-4o", name: "OpenAI GPT-4o", provider: "OpenAI" },
  { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gemini-1-5-pro", name: "Google Gemini 1.5 Pro", provider: "Gemini" },
  { id: "deepseek-v3", name: "DeepSeek-V3", provider: "DeepSeek" },
  { id: "grok-beta", name: "xAI Grok Beta", provider: "Grok" },
  { id: "ollama-local", name: "Ollama (Local Host)", provider: "Ollama" }
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am your GSMAXALL AI Copilot. I have access to your current workspace, terminal console, and vector knowledge base. Ask me anything, or specify a model to start a session.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const [ragContext, setRagContext] = useState(false);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      // API request to Next.js API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.content,
          model: selectedModel,
          webSearch,
          ragContext,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: data.reply,
        model: selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      // Fallback message
      const fallbackMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: "Error connecting to AI Provider. Please check your API keys in the Settings Panel or verify the server execution state.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachments(prev => [...prev, file.name]);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am your GSMAXALL AI Copilot. Ask me anything, or specify a model to start a session.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Header / Selector */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-border bg-card/40 backdrop-blur-md gap-4 z-10">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-indigo-500" />
          <h1 className="font-semibold tracking-tight text-base">Multi-Model AI Chat</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Model Selection Dropdown */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          {/* Toggle buttons */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setWebSearch(!webSearch)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                webSearch 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle Web Search"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              onClick={() => setRagContext(!ragContext)}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                ragContext 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Inject Vector RAG Context"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RAG</span>
            </button>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-md border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
            title="Clear Chat Logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-xl p-4 border space-y-2.5 ${
                  msg.role === "user"
                    ? "bg-foreground/5 text-foreground border-border/80"
                    : "bg-card text-foreground border-border"
                }`}
              >
                {/* Meta details */}
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wider">
                    {msg.role === "user" ? "You" : `${msg.model ? MODELS.find(m => m.id === msg.model)?.name : "Copilot"}`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Content text */}
                <div className="text-sm prose dark:prose-invert break-words leading-relaxed">
                  {msg.content.split("\n").map((line, i) => {
                    if (line.startsWith("```")) {
                      return null; // Handle code formatting simply
                    }
                    return <p key={i}>{line}</p>;
                  })}
                </div>

                {/* Attachments rendering */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
                    {msg.attachments.map((name, i) => (
                      <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded border border-border flex items-center gap-1">
                        <Paperclip className="w-3 h-3 text-muted-foreground" />
                        {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted border border-border text-foreground flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold text-xs shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="max-w-[80%] rounded-xl p-4 border bg-card text-foreground border-border flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Copilot is composing reply...</span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input panel container */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-md p-4">
        <div className="max-w-4xl mx-auto">
          {/* File attachments queue display */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 bg-muted/40 p-2 rounded-lg border border-border">
              {attachments.map((name, idx) => (
                <span key={idx} className="text-xs bg-card border border-border px-2 py-1 rounded-md flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{name}</span>
                  <button 
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-red-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="relative rounded-xl border border-border bg-background shadow-sm overflow-hidden flex flex-col">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask GSMAXALL AI to write code, design architectures, or inspect logs..."
              rows={2}
              className="w-full resize-none bg-transparent py-3 px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />

            <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/20">
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Attach Workspace File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Voice Input dictation"
                  onClick={() => alert("Voice transcription started. Speak into your microphone.")}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">
                  Enter to Send, Shift+Enter for newline
                </span>
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && attachments.length === 0)}
                  className="px-3 py-1.5 rounded-md bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  Send Message <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
}
