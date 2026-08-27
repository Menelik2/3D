type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  return (
    <header className={`mb-14 md:mb-20 max-w-3xl ${alignCls}`}>
      {eyebrow && (
        <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-balance">
        {title}
      </h1>
      {description && (
        <p className="mt-5 text-muted text-sm sm:text-base leading-relaxed max-w-2xl text-pretty">
          {description}
        </p>
      )}
      <div
        className={`mt-8 h-px w-16 bg-accent/80 ${align === "center" ? "mx-auto" : ""}`}
      />
    </header>
  );
}
