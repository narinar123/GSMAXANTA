"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import io, { Socket } from "socket.io-client";
import { 
  Folder, 
  File as FileIcon, 
  Play, 
  Terminal as TerminalIcon, 
  Plus, 
  Trash, 
  GitBranch, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Save,
  Search,
  Check,
  AlertTriangle
} from "lucide-react";

interface WorkspaceFile {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  content?: string;
}

export default function IDEPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketStatus, setSocketStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  
  // File System State
  const [files, setFiles] = useState<WorkspaceFile[]>([
    { name: "README.md", path: "README.md", isDirectory: false, content: "# GSMAXALL Workspace\nWelcome to your IDE!\nEdit code or ask AI to write features." },
    { name: "index.js", path: "index.js", isDirectory: false, content: '// Hello GSMAXALL OS\nconsole.log("Welcome to the workspace!");\n\nfunction calculateSum(a, b) {\n  return a + b;\n}\n\nmodule.exports = { calculateSum };' },
    { name: "package.json", path: "package.json", isDirectory: false, content: '{\n  "name": "workspace-project",\n  "version": "1.0.0",\n  "dependencies": {}\n}' }
  ]);
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null);
  const [editorValue, setEditorValue] = useState("");
  
  // New File/Folder Prompts
  const [showNewFilePrompt, setShowNewFilePrompt] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileType, setNewFileType] = useState<"file" | "folder">("file");

  // Terminal state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "GSMAXALL Sandbox Shell v1.0.0 (Web Client Console)",
    "Connecting to workspace runner backend...",
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  // Tabs
  const [openTabs, setOpenTabs] = useState<WorkspaceFile[]>([]);
  
  // Git State
  const [gitBranch, setGitBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("");
  const [stagedFiles, setStagedFiles] = useState<string[]>(["index.js"]);
  const [isGitPanelOpen, setIsGitPanelOpen] = useState(false);

  // AI Code Gen panel
  const [aiInstruction, setAiInstruction] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize Socket.io Connection
  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_RUNNER_WS_URL || "ws://localhost:3001";
    console.log(`Connecting to WebSocket runner at ${wsUrl}...`);
    
    const socketIo = io(wsUrl, {
      reconnectionAttempts: 3,
      timeout: 5000
    });

    socketIo.on("connect", () => {
      console.log("WebSocket runner connected!");
      setSocketStatus("connected");
      setTerminalLogs(prev => [...prev, "✓ Connected to workspace runner server.", "$ "]);
      socketIo.emit("file:list", "");
      socketIo.emit("terminal:init");
    });

    socketIo.on("connect_error", () => {
      console.warn("Could not connect to WebSocket runner. Running in client sandboxed fallback mode.");
      setSocketStatus("disconnected");
      setTerminalLogs(prev => [...prev, "⚠ Runner unavailable. Running in simulated fallback mode.", "$ "]);
    });

    socketIo.on("file:list:response", ({ files: fileList }: { files: WorkspaceFile[] }) => {
      if (fileList && fileList.length > 0) {
        setFiles(fileList);
      }
    });

    socketIo.on("file:read:response", ({ path, content }: { path: string, content: string }) => {
      const updatedFiles = files.map(f => f.path === path ? { ...f, content } : f);
      setFiles(updatedFiles);
      
      const targetFile = updatedFiles.find(f => f.path === path) || { name: path.split("/").pop() || "", path, isDirectory: false, content };
      setActiveFile(targetFile);
      setEditorValue(content);
      
      // Add to tabs if not already present
      if (!openTabs.find(t => t.path === path)) {
        setOpenTabs(prev => [...prev, targetFile]);
      }
    });

    socketIo.on("terminal:output", (data: string) => {
      setTerminalLogs(prev => {
        // Simple append, cleaning up multiple consecutive prompts if needed
        const newLogs = [...prev];
        const lines = data.split("\r\n");
        lines.forEach(l => {
          if (l) newLogs.push(l);
        });
        return newLogs;
      });
    });

    socketIo.on("file:change", () => {
      socketIo.emit("file:list", "");
    });

    setSocket(socketIo);

    // Default select first file
    setActiveFile(files[0]);
    setEditorValue(files[0].content || "");
    setOpenTabs([files[0]]);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Terminal scroll handler
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Open file handler
  const handleOpenFile = (file: WorkspaceFile) => {
    if (file.isDirectory) return;
    if (socket && socketStatus === "connected") {
      socket.emit("file:read", file.path);
    } else {
      // Fallback
      setActiveFile(file);
      setEditorValue(file.content || "");
      if (!openTabs.find(t => t.path === file.path)) {
        setOpenTabs(prev => [...prev, file]);
      }
    }
  };

  // Save active file content
  const handleSaveFile = () => {
    if (!activeFile) return;
    if (socket && socketStatus === "connected") {
      socket.emit("file:write", { path: activeFile.path, content: editorValue });
      // Update local cache
      setFiles(prev => prev.map(f => f.path === activeFile.path ? { ...f, content: editorValue } : f));
      setTerminalLogs(prev => [...prev, `[IDE] Saved file: ${activeFile.path}`]);
    } else {
      // Fallback
      const updated = { ...activeFile, content: editorValue };
      setFiles(prev => prev.map(f => f.path === activeFile.path ? updated : f));
      setActiveFile(updated);
      setTerminalLogs(prev => [...prev, `[IDE Sandbox] Saved file: ${activeFile.path} (local state)`]);
    }
  };

  // Create file or folder
  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const nodePath = newFileName.trim();
    if (newFileType === "file") {
      const newFile: WorkspaceFile = {
        name: nodePath.split("/").pop() || "",
        path: nodePath,
        isDirectory: false,
        content: `// New file ${nodePath}\n`
      };

      if (socket && socketStatus === "connected") {
        socket.emit("file:write", { path: nodePath, content: newFile.content });
      } else {
        setFiles(prev => [...prev, newFile]);
        setActiveFile(newFile);
        setEditorValue(newFile.content || "");
        setOpenTabs(prev => [...prev, newFile]);
      }
    } else {
      if (socket && socketStatus === "connected") {
        socket.emit("file:create-dir", nodePath);
      } else {
        setFiles(prev => [...prev, { name: nodePath, path: nodePath, isDirectory: true }]);
      }
    }

    setNewFileName("");
    setShowNewFilePrompt(false);
    setTerminalLogs(prev => [...prev, `[IDE] Created ${newFileType}: ${nodePath}`]);
  };

  // Delete node file
  const handleDeleteFile = (file: WorkspaceFile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${file.path}?`)) return;

    if (socket && socketStatus === "connected") {
      socket.emit("file:delete", file.path);
    } else {
      setFiles(prev => prev.filter(f => f.path !== file.path));
      setOpenTabs(prev => prev.filter(t => t.path !== file.path));
      if (activeFile?.path === file.path) {
        setActiveFile(files[0] || null);
        setEditorValue(files[0]?.content || "");
      }
    }
    setTerminalLogs(prev => [...prev, `[IDE] Deleted: ${file.path}`]);
  };

  // Exec command inside shell terminal
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    setTerminalLogs(prev => [...prev, cmd]);

    if (socket && socketStatus === "connected") {
      socket.emit("terminal:input", cmd + "\n");
    } else {
      // Mock Terminal Shell Logic
      let output = "";
      if (cmd === "ls") {
        output = files.map(f => `${f.isDirectory ? "\x1b[34m" : ""}${f.name}\x1b[0m`).join("   ");
      } else if (cmd.startsWith("cat ")) {
        const file = files.find(f => f.name === cmd.slice(4).trim());
        output = file ? file.content || "" : `cat: ${cmd.slice(4)}: No such file`;
      } else if (cmd === "npm run dev" || cmd === "node index.js") {
        output = "> workspace-project@1.0.0 dev\r\n> node index.js\r\n\r\nWelcome to the workspace!";
      } else {
        output = `sh: command not found: ${cmd.split(" ")[0]}`;
      }
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, output, "$ "]);
      }, 200);
    }

    setTerminalInput("");
  };

  // AI prompt helper to edit code
  const handleAiEdit = async () => {
    if (!aiInstruction.trim() || !activeFile) return;

    setIsAiLoading(true);
    setTerminalLogs(prev => [...prev, `[AI IDE] Instructed: "${aiInstruction}" for ${activeFile.path}...`]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-5-sonnet",
          message: `Given the file content:\n\n\`\`\`\n${editorValue}\n\`\`\`\n\nModify it to follow this instruction: "${aiInstruction}". Output only the raw modified code content without markdown wrap.`,
        })
      });
      const data = await response.json();
      
      let modifiedCode = data.reply;
      // Strip markdown wrapper blocks if any
      if (modifiedCode.startsWith("```")) {
        modifiedCode = modifiedCode.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
      }

      setEditorValue(modifiedCode);
      setIsAiLoading(false);
      setAiInstruction("");
      setTerminalLogs(prev => [...prev, `[AI IDE] Code generation completed successfully. Review changes and press Save.`]);
    } catch (e) {
      console.error(e);
      setIsAiLoading(false);
      setTerminalLogs(prev => [...prev, `[AI IDE] Failed to generate code revisions.`]);
    }
  };

  // Simulated Git committing
  const handleGitCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    setTerminalLogs(prev => [
      ...prev,
      `[Git] git commit -m "${commitMessage}"`,
      `[Git] Committed 1 file changes to branch ${gitBranch}`
    ]);
    setCommitMessage("");
    setStagedFiles([]);
    setIsGitPanelOpen(false);
  };

  return (
    <div className="flex h-full border-t border-border bg-background overflow-hidden">
      {/* File Explorer Sidebar */}
      <aside className="w-64 border-r border-border bg-card/40 flex flex-col justify-between shrink-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
              Workspace Files
            </span>
            <button
              onClick={() => {
                setNewFileType("file");
                setShowNewFilePrompt(!showNewFilePrompt);
              }}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Add File"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showNewFilePrompt && (
            <form onSubmit={handleCreateNode} className="p-3 border-b border-border space-y-2 bg-muted/20">
              <div className="flex items-center gap-2">
                <select 
                  value={newFileType} 
                  onChange={(e) => setNewFileType(e.target.value as "file" | "folder")}
                  className="text-[10px] bg-card border border-border rounded px-1 py-0.5 focus:outline-none"
                >
                  <option value="file">File</option>
                  <option value="folder">Folder</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. index.js"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="text-xs bg-card border border-border rounded px-2 py-0.5 w-full focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-1 text-[10px]">
                <button type="button" onClick={() => setShowNewFilePrompt(false)} className="px-2 py-0.5 hover:bg-muted rounded text-zinc-500">Cancel</button>
                <button type="submit" className="px-2 py-0.5 bg-indigo-600 text-white rounded font-semibold">Create</button>
              </div>
            </form>
          )}

          {/* Files List tree */}
          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => handleOpenFile(file)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeFile?.path === file.path 
                    ? "bg-foreground/5 text-foreground font-semibold" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {file.isDirectory ? (
                    <Folder className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  ) : (
                    <FileIcon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  )}
                  <span className="truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteFile(file, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-all"
                  title="Delete"
                >
                  <Trash className="w-3 h-3" />
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Git panel Toggle */}
        <div className="border-t border-border">
          <button
            onClick={() => setIsGitPanelOpen(!isGitPanelOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors text-left"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <GitBranch className="w-4 h-4 text-violet-500" />
              <span>Git Integration</span>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-semibold">
              {gitBranch}
            </span>
          </button>

          {isGitPanelOpen && (
            <div className="p-4 bg-muted/10 border-t border-border space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider font-semibold">Staged Changes</span>
                {stagedFiles.map(f => (
                  <div key={f} className="text-xs font-mono text-green-400 flex items-center gap-1">
                    + {f}
                  </div>
                ))}
              </div>
              <form onSubmit={handleGitCommit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 bg-card border border-border rounded-md focus:outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!commitMessage.trim()}
                  className="w-full py-1 bg-foreground text-background text-xs font-semibold rounded-md hover:opacity-95"
                >
                  Commit changes
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>

      {/* Editor & Console Split */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs & Save */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/40">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {openTabs.map(tab => (
              <button
                key={tab.path}
                onClick={() => handleOpenFile(tab)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 ${
                  activeFile?.path === tab.path
                    ? "bg-background text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileIcon className="w-3 h-3 text-zinc-400" />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveFile}
              className="p-1.5 rounded-md border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Save active file"
            >
              <Save className="w-4 h-4" /> Save
            </button>
            <button
              className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center gap-1"
              onClick={() => {
                setTerminalLogs(prev => [...prev, `[IDE] Executing Node file: ${activeFile?.path || "index.js"}`]);
                if (socket && socketStatus === "connected") {
                  socket.emit("terminal:input", `node ${activeFile?.path || "index.js"}\n`);
                } else {
                  setTimeout(() => {
                    setTerminalLogs(prev => [
                      ...prev,
                      "> workspace-project@1.0.0 dev",
                      "> node index.js",
                      "Welcome to the workspace!",
                      "$ "
                    ]);
                  }, 200);
                }
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run
            </button>
          </div>
        </header>

        {/* AI Action Overlay */}
        <div className="flex items-center justify-between px-4 py-2 bg-indigo-500/5 border-b border-border/80 gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
            <span>AI Code Copilot</span>
          </div>
          <div className="flex-1 flex gap-2 max-w-2xl">
            <input
              type="text"
              placeholder="Describe modifications (e.g. 'Add a function to greet users')"
              value={aiInstruction}
              onChange={(e) => setAiInstruction(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-background border border-border rounded-lg focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAiEdit();
              }}
            />
            <button
              onClick={handleAiEdit}
              disabled={isAiLoading || !aiInstruction.trim()}
              className="px-3 py-1 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-500 shrink-0"
            >
              {isAiLoading ? "Writing..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-0 relative">
          <Editor
            height="100%"
            language={activeFile?.name.endsWith(".json") ? "json" : activeFile?.name.endsWith(".prisma") ? "prisma" : "javascript"}
            theme="vs-dark"
            value={editorValue}
            onChange={(val) => setEditorValue(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              lineHeight: 20,
              padding: { top: 12 }
            }}
          />
        </div>

        {/* Terminal Console Panel */}
        <div className="h-64 border-t border-border bg-[#030303] flex flex-col justify-between shrink-0">
          <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-black/60">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Workspace Terminal Console</span>
            </div>
            {socketStatus === "connected" ? (
              <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-mono">
                RUNNER ACTIVE
              </span>
            ) : (
              <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> DEMO FALLBACK
              </span>
            )}
          </header>

          {/* Terminal Logs View */}
          <div className="flex-1 p-4 font-mono text-xs text-zinc-300 space-y-1.5 overflow-y-auto bg-black/80">
            {terminalLogs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-all leading-relaxed">
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleTerminalSubmit} className="flex border-t border-zinc-900 bg-black/40">
            <span className="pl-4 py-2 text-zinc-500 font-mono text-xs select-none">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="Type shell commands (e.g. 'npm run dev', 'ls')..."
              className="flex-1 bg-transparent px-2.5 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
