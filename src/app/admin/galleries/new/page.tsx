import Link from "next/link";
import { GalleryForm } from "@/components/admin/GalleryForm";

export default function NewGalleryPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/galleries"
          className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← Galleries
        </Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New client gallery</h1>
        <p className="mt-1 text-sm text-muted">
          Creates a private link and QR code. Add photos on the next screen.
        </p>
      </div>
      <GalleryForm />
    </div>
  );
}
