"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Mail, Terminal, Globe, GitBranch } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // Mock authentication
    setTimeout(() => {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: "usr-mock-123",
          email: email,
          name: email.split("@")[0].toUpperCase(),
          tier: "PRO",
          role: "ADMIN"
        })
      );
      router.push("/dashboard");
    }, 1000);
  };

  const handleOAuthLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: `usr-${provider}-mock`,
          email: `${provider}-user@gsmaxall.ai`,
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Builder`,
          tier: "PRO",
          role: "ADMIN"
        })
      );
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col justify-center items-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <a 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Home
      </a>

      {/* Brand logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-800 mb-4">
          <img src="https://www.gsgroups.net/gslogo.png" alt="GSMAXALL Logo" className="w-8 h-8 object-contain invert" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Sign in to GSMAXALL</h2>
        <p className="text-xs text-zinc-500 mt-1">Access your unified AI workstation</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md shadow-xl">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 font-semibold mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:outline-none text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs text-zinc-400 font-semibold">Password</label>
              <a href="#" className="text-[10px] text-zinc-500 hover:text-zinc-300">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-indigo-500 focus:outline-none text-sm font-medium transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-semibold text-sm transition-colors mt-6 flex items-center justify-center"
          >
            {loading ? "Signing in..." : "Continue with Email"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 border-t border-zinc-900" />
          <span className="relative bg-zinc-950 px-3 text-[10px] text-zinc-600 uppercase tracking-widest font-mono">
            Or auth with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
            className="py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Globe className="w-3.5 h-3.5" /> Google
          </button>
          <button
            onClick={() => handleOAuthLogin("github")}
            disabled={loading}
            className="py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5" /> GitHub
          </button>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mt-6">
        Don't have an account?{" "}
        <a href="/signup" className="text-zinc-300 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
}
