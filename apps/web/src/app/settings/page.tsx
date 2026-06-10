"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Key, 
  Sun, 
  Moon, 
  User, 
  Save, 
  CheckCircle,
  Database,
  Cloud,
  Terminal,
  Activity
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"api" | "profile" | "theme">("api");
  const [saveStatus, setSaveStatus] = useState("");
  
  // API keys state
  const [openaiKey, setOpenaiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [grokKey, setGrokKey] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  
  // Profile settings
  const [name, setName] = useState("Developer");
  const [email, setEmail] = useState("developer@gsmaxall.ai");
  const [tier, setTier] = useState("PRO");

  // Load from local storage on mount
  useEffect(() => {
    const savedKeys = localStorage.getItem("workspace_keys");
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys);
        setOpenaiKey(parsed.openaiKey || "");
        setClaudeKey(parsed.claudeKey || "");
        setGeminiKey(parsed.geminiKey || "");
        setDeepseekKey(parsed.deepseekKey || "");
        setGrokKey(parsed.grokKey || "");
        setOllamaUrl(parsed.ollamaUrl || "http://localhost:11434");
      } catch (e) {
        console.error(e);
      }
    }

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setName(parsed.name || "Developer");
        setEmail(parsed.email || "developer@gsmaxall.ai");
        setTier(parsed.tier || "PRO");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving...");

    const keys = {
      openaiKey,
      claudeKey,
      geminiKey,
      deepseekKey,
      grokKey,
      ollamaUrl
    };

    localStorage.setItem("workspace_keys", JSON.stringify(keys));
    
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 800);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving...");

    const updatedUser = {
      id: "usr-mock-123",
      email,
      name,
      tier,
      role: "ADMIN"
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 800);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-500" />
          System Workstation Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure model provider credentials, interface layouts, and active user profile details.
        </p>
      </div>

      {/* Main split settings panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-border rounded-xl bg-card overflow-hidden">
        {/* Left Side Tab Navigation */}
        <nav className="border-r border-border md:col-span-1 p-4 space-y-1 bg-card/40 flex flex-row md:flex-col overflow-x-auto">
          <button
            onClick={() => setActiveTab("api")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "api"
                ? "bg-foreground/5 text-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Key className="w-4 h-4 text-indigo-500" />
            <span>LLM Providers</span>
          </button>
          
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeTab === "profile"
                ? "bg-foreground/5 text-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4 text-violet-500" />
            <span>User Profile</span>
          </button>
        </nav>

        {/* Right Content Area */}
        <div className="md:col-span-3 p-6 bg-background">
          {saveStatus === "saved" && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-green-400 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Save operation completed successfully!
            </div>
          )}

          {activeTab === "api" && (
            <form onSubmit={handleSaveKeys} className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-foreground">API Credentials configuration</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Input your API keys. They are securely cached locally in your browser workspace session.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">OpenAI API Key</label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Anthropic Claude Key</label>
                  <input
                    type="password"
                    placeholder="sk-ant-..."
                    value={claudeKey}
                    onChange={(e) => setClaudeKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Google Gemini Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">DeepSeek-V3 Key</label>
                  <input
                    type="password"
                    placeholder="sk-ds-..."
                    value={deepseekKey}
                    onChange={(e) => setDeepseekKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">xAI Grok Key</label>
                  <input
                    type="password"
                    placeholder="xai-..."
                    value={grokKey}
                    onChange={(e) => setGrokKey(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Ollama API Endpoint</label>
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saveStatus === "saving..."}
                  className="px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {saveStatus === "saving..." ? "Saving..." : "Save Config"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h3 className="font-bold text-sm text-foreground">User Profile Metadata</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage active credentials and workspace billing details.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-semibold tracking-wider text-muted-foreground">Active Subscription Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card border border-border rounded-lg focus:outline-none"
                  >
                    <option value="FREE">Free Trial Tier</option>
                    <option value="PRO">Professional Builder ($29/mo)</option>
                    <option value="ENTERPRISE">Enterprise Tier Custom</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saveStatus === "saving..."}
                  className="px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> {saveStatus === "saving..." ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
