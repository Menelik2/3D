"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
  const notAdmin = searchParams.get("error") === "not_admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    notAdmin ? "This account is not an admin. Use the single admin account." : null
  );
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

      // Confirm this user is SUPER_ADMIN or ADMIN
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        const role = profile?.role;
        if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
          await supabase.auth.signOut();
          setError(
            "Not an admin account. Create one user in Supabase Auth, then run supabase/single-admin-setup.sql."
          );
          setLoading(false);
          return;
        }
      }

      router.replace(next);
      router.refresh();
    } catch {
      setError("Login failed. Check connection and .env.local keys.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-border bg-card/40 p-8">
      <p className="text-[10px] uppercase tracking-widest text-muted mb-2">META Pictures</p>
      <h1 className="text-2xl font-light tracking-tight">Admin login</h1>
      <p className="mt-2 text-sm text-muted">
        Single admin access. Only accounts with role <strong className="text-foreground/90">SUPER_ADMIN</strong> or{" "}
        <strong className="text-foreground/90">ADMIN</strong> can enter.
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

      <div className="mt-8 border-t border-border pt-6 text-xs text-muted space-y-2">
        <p className="uppercase tracking-widest text-[10px]">Setup (once)</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Supabase → Authentication → Users → Add user (email + password)</li>
          <li>Open <code className="text-foreground/80">supabase/single-admin-setup.sql</code></li>
          <li>Replace the email and run it in SQL Editor</li>
        </ol>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/" className="hover:text-foreground">← Back to site</Link>
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
