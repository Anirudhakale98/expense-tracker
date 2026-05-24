"use client";

import { apiFetch } from "@/lib/client-fetch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister
        ? { name, email, password }
        : { email, password };

      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      router.replace(from.startsWith("/") ? from : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {isRegister ? "Create account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {isRegister
            ? "Your expenses stay private to your account"
            : "Sign in to your expense tracker"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-600">
              Name
            </label>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="Your name"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-600">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="touch-target w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white active:bg-emerald-700 disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-emerald-600">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-medium text-emerald-600">
              Create account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
