"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-sm border border-white/10 bg-white/[0.03] p-0.5 ${className}`}
      role="group"
      aria-label={t.lang.switchTo}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] transition-all duration-300 ${
          locale === "en"
            ? "bg-accent text-white shadow-[0_0_16px_rgba(225,29,72,0.35)]"
            : "text-white/50 hover:text-white"
        }`}
        aria-pressed={locale === "en"}
      >
        {compact ? "EN" : t.lang.en}
      </button>
      <button
        type="button"
        onClick={() => setLocale("am")}
        className={`px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] transition-all duration-300 ${
          locale === "am"
            ? "bg-accent text-white shadow-[0_0_16px_rgba(225,29,72,0.35)]"
            : "text-white/50 hover:text-white"
        }`}
        aria-pressed={locale === "am"}
      >
        {t.lang.am}
      </button>
    </div>
  );
}
