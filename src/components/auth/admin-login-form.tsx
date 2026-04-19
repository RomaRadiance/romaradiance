"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured yet.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Email</span>
        <input
          name="email"
          type="email"
          required
          className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_0_#173256]"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Password</span>
        <input
          name="password"
          type="password"
          required
          className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_0_#173256]"
        />
      </label>

      <button type="submit" disabled={loading} className="cta-button cta-primary justify-center">
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </form>
  );
}
