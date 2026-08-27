import Link from "next/link";

type Props = {
  title?: string;
  description?: string;
};

export function CtaBlock({
  title = "Ready to tell your story?",
  description = "Share your idea, timeline, and vision. We’ll shape it into cinema.",
}: Props) {
  return (
    <section className="relative mt-20 border-t border-border pt-16 md:pt-20 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(225,29,72,0.1), transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-light tracking-tight">{title}</h2>
        <p className="mt-4 text-sm text-muted leading-relaxed">{description}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/start-a-project" className="btn-primary min-w-[180px]">
            Start a Project
          </Link>
          <Link href="/book-consultation" className="btn-ghost min-w-[180px]">
            Book Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
