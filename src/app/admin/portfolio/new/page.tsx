import Link from "next/link";
import { PortfolioForm } from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/portfolio" className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground">
          ← Portfolio
        </Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New portfolio item</h1>
      </div>
      <PortfolioForm />
    </div>
  );
}
