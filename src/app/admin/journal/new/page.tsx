import Link from "next/link";
import { JournalForm } from "@/components/admin/JournalForm";

export default function NewJournalPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/journal" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">← Journal</Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New journal post</h1>
      </div>
      <JournalForm />
    </div>
  );
}
