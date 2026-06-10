"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Code2,
  Cpu,
  GitBranch,
  Database,
  Settings as SettingsIcon,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Terminal
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Chat", href: "/chat", icon: MessageSquare },
  { name: "AI IDE Workspace", href: "/ide", icon: Code2 },
  { name: "Autonomous Agents", href: "/agents", icon: Cpu },
  { name: "n8n Workflows", href: "/workflows", icon: GitBranch },
  { name: "Knowledge Hub", href: "/knowledge", icon: Database },
  { name: "System Settings", href: "/settings", icon: SettingsIcon },
  { name: "Admin Panel", href: "/admin", icon: Shield }
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [userName, setUserName] = useState("Developer");
  const [userEmail, setUserEmail] = useState("developer@gsmaxall.ai");

  useEffect(() => {
    // Load theme preference
    const storedTheme = localStorage.getItem("theme");
    const root = window.document.documentElement;
    if (storedTheme === "light") {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }

    // Load active session user if stored
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserName(parsed.name || "Developer");
        setUserEmail(parsed.email || "developer@gsmaxall.ai");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/40 backdrop-blur-md z-30">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center overflow-hidden border border-border">
            <img 
              src="https://www.gsgroups.net/gslogo.png" 
              alt="GSMAXALL Logo" 
              className="w-6 h-6 object-contain invert dark:invert-0"
              onError={(e) => {
                // Fallback icon if logo fails to load
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'text-background font-bold text-sm';
                  fallback.innerText = 'GS';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
          <span className="font-semibold tracking-tight text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            GSMAXALL
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-foreground/5 text-foreground border-l-2 border-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer controls & Profile */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted-foreground" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">
                Runner Active
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground border border-border">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{userName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-background/80 backdrop-blur-sm">
          <aside className="flex flex-col w-72 h-full border-r border-border bg-card">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center overflow-hidden border border-border">
                  <img src="https://www.gsgroups.net/gslogo.png" alt="Logo" className="w-6 h-6 object-contain invert dark:invert-0" />
                </div>
                <span className="font-semibold text-lg">GSMAXALL</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-foreground/5 text-foreground border-l-2 border-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4" /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" /> Dark Mode
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs text-red-500 hover:opacity-80"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border md:hidden bg-card/60 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center overflow-hidden">
              <img src="https://www.gsgroups.net/gslogo.png" alt="Logo" className="w-4 h-4 object-contain invert dark:invert-0" />
            </div>
            <span className="font-semibold tracking-tight text-sm">GSMAXALL</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-md hover:bg-muted text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Child Page */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
