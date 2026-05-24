"use client";

import { ExpenseForm } from "@/components/ExpenseForm";
import { PageShell } from "@/components/PageShell";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();

  return (
    <PageShell title="Add expense">
      <ExpenseForm onSuccess={() => router.push("/")} />
    </PageShell>
  );
}
