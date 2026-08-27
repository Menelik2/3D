import Link from "next/link";
import { FaqForm } from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/faqs" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">← FAQs</Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New FAQ</h1>
      </div>
      <FaqForm />
    </div>
  );
}
