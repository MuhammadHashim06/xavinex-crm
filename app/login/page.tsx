"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center font-bold text-4xl text-white mx-auto shadow-2xl shadow-accent/30 mb-6 rotate-3">X</div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">XAVINEX CRM</h1>
          <p className="text-muted font-medium">Welcome back, Admin</p>
        </div>

        <div className="bg-card p-8 rounded-[2rem] border border-border shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-sm font-bold text-center animate-shake">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} />
                Email Address
              </label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-muted/30"
                placeholder="admin@xavinex.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} />
                Password
              </label>
              <div className="relative">
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-accent transition-all placeholder:text-muted/30 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className={`w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'glow-button'}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center text-muted text-[10px] font-bold uppercase tracking-widest mt-8 opacity-40">
          SECURE ADMIN ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
