import { AuthForm } from "@/components/AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-4 py-8">
      <Suspense fallback={<p className="text-center text-zinc-500">Loading…</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
