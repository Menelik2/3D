"use client";

type Props = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  counts?: Record<string, number>;
};

export function CategoryFilter({ categories, active, onChange, counts }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        const count = counts?.[cat];
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={`min-h-11 border px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-[color,background-color,border-color,transform] duration-200 ease-out ${
              isActive
                ? "border-accent bg-accent/15 text-foreground -translate-y-px"
                : "border-border text-muted hover:border-white/25 hover:text-foreground hover:-translate-y-px"
            }`}
          >
            {cat}
            {typeof count === "number" && (
              <span className="ml-1.5 tabular-nums opacity-50">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Build unique category list + counts from items. */
export function buildCategoryOptions(
  items: { category: string | null | undefined }[],
  fallbackLabels: string[] = []
): { categories: string[]; counts: Record<string, number> } {
  const counts: Record<string, number> = { All: items.length };

  for (const item of items) {
    const raw = (item.category || "").trim();
    if (!raw) continue;
    counts[raw] = (counts[raw] || 0) + 1;
  }

  const fromData = Object.keys(counts)
    .filter((k) => k !== "All")
    .sort((a, b) => a.localeCompare(b));

  const categories =
    fromData.length > 0
      ? ["All", ...fromData]
      : ["All", ...fallbackLabels.filter((l) => l !== "All")];

  return { categories, counts };
}

export function matchesCategory(
  itemCategory: string | null | undefined,
  active: string
): boolean {
  if (active === "All") return true;
  const a = (itemCategory || "").trim().toLowerCase();
  const b = active.trim().toLowerCase();
  if (!a) return false;
  return a === b || a.includes(b) || b.includes(a);
}
