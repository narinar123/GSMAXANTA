"use client";

import React, { useState } from "react";
import { 
  Database, 
  Upload, 
  FileText, 
  Trash2, 
  BookOpen, 
  Save,
  Plus,
  Sparkles,
  Server,
  FileCode,
  FileCheck
} from "lucide-react";

interface VectorDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  chunks: number;
  status: "ready" | "indexing" | "failed";
}

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<VectorDocument[]>([
    { id: "doc-1", name: "gsmaxall-api-spec.pdf", type: "PDF", size: "1.2 MB", chunks: 45, status: "ready" },
    { id: "doc-2", name: "deployment-guidelines.md", type: "Markdown", size: "24 KB", chunks: 8, status: "ready" },
    { id: "doc-3", name: "qdrant-schema-notes.txt", type: "Text", size: "8 KB", chunks: 3, status: "ready" }
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: "note-1", title: "Project Architectural Overview", content: "# GSMAXALL OS Architecture\nThis platform leverages a micro-runner WebSocket server for shell sandboxing, Redis for pub/sub message queuing, and Qdrant for document embeddings.\n\n## Data Storage\n- User profiles and metadata are saved in PostgreSQL (via Prisma).\n- High-dimensional vector chunks are saved in Qdrant.", updatedAt: "10:30 AM" },
    { id: "note-2", title: "RAG Prompt Templates", content: "Use this template for vector context injection:\n\n```text\nGiven the context from our documentation:\n{{context}}\n\nAnswer the user query: {{query}}\n```", updatedAt: "Yesterday" }
  ]);

  const [activeNote, setActiveNote] = useState<Note | null>(notes[0]);
  const [noteTitle, setNoteTitle] = useState(notes[0]?.title || "");
  const [noteContent, setNoteContent] = useState(notes[0]?.content || "");
  const [saveStatus, setSaveStatus] = useState("auto-saved");
  const [uploading, setUploading] = useState(false);

  // Note editor actions
  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setSaveStatus("saved");
  };

  const handleNoteChange = (content: string) => {
    setNoteContent(content);
    setSaveStatus("saving...");
    
    // Simulate auto-save
    setTimeout(() => {
      setNotes(prev => prev.map(n => 
        n.id === activeNote?.id 
          ? { ...n, content, title: noteTitle, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
          : n
      ));
      setSaveStatus("auto-saved");
    }, 1000);
  };

  const handleTitleChange = (title: string) => {
    setNoteTitle(title);
    setSaveStatus("saving...");
    
    setTimeout(() => {
      setNotes(prev => prev.map(n => 
        n.id === activeNote?.id 
          ? { ...n, title, content: noteContent, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
          : n
      ));
      setSaveStatus("auto-saved");
    }, 1000);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      content: "# New Document\nStart drafting markdown guidelines here...",
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setNotes(prev => [newNote, ...prev]);
    handleSelectNote(newNote);
  };

  const handleDeleteNote = (id: string) => {
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (activeNote?.id === id) {
      setActiveNote(filtered[0] || null);
      setNoteTitle(filtered[0]?.title || "");
      setNoteContent(filtered[0]?.content || "");
    }
  };

  // Mock Upload Document to vector index
  const handleUploadDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);

      const newDoc: VectorDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() || "TXT",
        size: `${Math.round(file.size / 1024)} KB`,
        chunks: 0,
        status: "indexing"
      };

      setDocuments(prev => [newDoc, ...prev]);

      // Simulate chunking and embedding latency
      setTimeout(() => {
        setDocuments(prev => prev.map(d => 
          d.id === newDoc.id 
            ? { ...d, chunks: Math.floor(Math.random() * 15) + 3, status: "ready" } 
            : d
        ));
        setUploading(false);
      }, 3000);
    }
  };

  const handleDeleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto h-full flex flex-col justify-between">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-500" />
            Knowledge Hub RAG Registry
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Index local documentation files to Qdrant vector database to feed context to AI Chat prompts.
          </p>
        </div>
        
        {/* Qdrant Status indicators */}
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-lg border border-border text-xs">
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <Server className="w-3.5 h-3.5" />
            <span>Qdrant: http://localhost:6333</span>
          </div>
          <span className="text-green-500 font-semibold flex items-center gap-1">
            ● Connected
          </span>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left column: Vector Registry & Uploads */}
        <div className="space-y-6 lg:col-span-1">
          {/* Document list & Drag-Drop */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xs uppercase font-mono tracking-wider text-muted-foreground">
                Indexed Documents
              </h3>
              <label className="p-1 hover:bg-muted text-indigo-500 hover:text-indigo-600 rounded cursor-pointer transition-colors" title="Upload Document">
                <Upload className="w-4 h-4" />
                <input type="file" className="hidden" onChange={handleUploadDoc} disabled={uploading} />
              </label>
            </div>

            {/* Document list cards */}
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg border border-border bg-background flex items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate text-foreground">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {doc.type} &bull; {doc.size} &bull; {doc.chunks > 0 ? `${doc.chunks} vector chunks` : "indexing..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {doc.status === "indexing" ? (
                      <span className="w-3 h-3 rounded-full border border-indigo-500 border-t-transparent animate-spin" />
                    ) : (
                      <FileCheck className="w-4 h-4 text-green-500" />
                    )}
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded transition-colors"
                      title="Remove Index"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload guidelines */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border/60 text-[10px] text-muted-foreground space-y-1.5 leading-relaxed">
              <p className="font-semibold text-foreground uppercase tracking-wider font-mono">Embedding Details</p>
              <p>Uploaded PDF, MD, and TXT files are processed inside our runner using LangChain text splitters, embedded with OpenAI text-embedding-ada-002, and uploaded directly to Qdrant vector collections.</p>
            </div>
          </div>
        </div>

        {/* Right column: Notepad Workspace */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 border border-border rounded-xl bg-card overflow-hidden">
          {/* Notes List panel */}
          <div className="border-r border-border md:col-span-1 flex flex-col justify-between h-[500px]">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                <span className="text-xs uppercase font-mono tracking-wider text-muted-foreground font-semibold">
                  Workspace Notes
                </span>
                <button
                  onClick={handleCreateNote}
                  className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition-colors"
                  title="Add Note"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-lg text-xs cursor-pointer transition-colors relative group ${
                      activeNote?.id === note.id
                        ? "bg-foreground/5 text-foreground border-l-2 border-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold truncate pr-4">{note.title || "Untitled"}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded absolute right-2 top-2.5 transition-all"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      {note.content.substring(0, 40)}...
                    </p>
                    <p className="text-[9px] text-zinc-500 font-mono mt-1.5">{note.updatedAt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Note Editor workspace */}
          <div className="md:col-span-2 flex flex-col justify-between h-[500px] bg-background">
            {activeNote ? (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Editor Header panel */}
                <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/20 shrink-0">
                  <span className="text-[10px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    {saveStatus}
                  </span>
                  <button 
                    onClick={() => alert("Note manual backup saved to workspace.")}
                    className="p-1 px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground text-[10px] font-mono border border-border rounded flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> BACKUP
                  </button>
                </header>

                {/* Editor Text inputs */}
                <div className="flex-1 p-6 space-y-4 overflow-y-auto flex flex-col">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Note Title"
                    className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 w-full"
                  />
                  <textarea
                    value={noteContent}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    placeholder="Draft markdown guidelines..."
                    className="flex-1 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-sm leading-relaxed font-mono placeholder:text-muted-foreground/40 w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-xs text-muted-foreground">
                <BookOpen className="w-8 h-8 text-zinc-600 mb-2" />
                Select an existing note or click Add to create a new markdown workbook.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
