"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type Dictionary,
  type Locale,
  defaultLocale,
  getDictionary,
  LOCALE_STORAGE_KEY,
  locales,
} from "./dictionaries";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "am") return stored;
  } catch {
    /* ignore */
  }
  return defaultLocale;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = readStoredLocale();
    setLocaleState(initial);
    document.documentElement.lang = initial === "am" ? "am" : "en";
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    if (!locales.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = next === "am" ? "am" : "en";
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "am" : "en");
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return (
    <I18nContext.Provider value={value}>
      <div
        className={ready && locale === "am" ? "font-amharic" : undefined}
        lang={locale === "am" ? "am" : "en"}
      >
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LanguageProvider");
  }
  return ctx;
}

export function useT() {
  return useI18n().t;
}
