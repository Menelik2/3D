"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("Login failed. Check your connection and Supabase keys.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-card/40 p-8">
        <p className="text-[10px] uppercase tracking-widest text-muted mb-2">META Pictures</p>
        <h1 className="text-2xl font-light tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-muted">
          Sign in with a staff account (Supabase Auth). Create users in the Auth dashboard,
          then set <code className="text-foreground/80">profiles.role</code> to ADMIN or SUPER_ADMIN.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-accent outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent px-6 py-3 text-xs font-medium uppercase tracking-widest text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          <Link href="/" className="hover:text-foreground">← Back to site</Link>
        </p>
      </div>
    </div>
  );
}
