"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import "@/app/gallery-wishes.css";

export type WishItem = {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
};

const PAGE_SIZE = 100;

function formatWishTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "";
  }
}

export function GalleryBestWishes({
  token,
  initialWishes = [],
  initialTotal,
}: {
  token: string;
  initialWishes?: WishItem[];
  /** Total wishes in DB (may be > initialWishes.length). */
  initialTotal?: number;
}) {
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [total, setTotal] = useState(
    Math.max(initialTotal ?? 0, initialWishes.length)
  );
  const [showWishes, setShowWishes] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

  const hasMore = wishes.length < total;

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && message.trim().length > 0 && !submitting;
  }, [name, message, submitting]);

  function validate(): boolean {
    const next: { name?: string; message?: string } = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!message.trim()) next.message = "Please write a wish or message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const offset = wishes.length;
      const res = await fetch(
        `/api/g/${encodeURIComponent(token)}/wishes?limit=${PAGE_SIZE}&offset=${offset}`
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.items)) {
        setWishes((prev) => {
          const seen = new Set(prev.map((w) => w.id));
          const next = [...prev];
          for (const item of data.items as WishItem[]) {
            if (!seen.has(item.id)) next.push(item);
          }
          return next;
        });
        if (typeof data.total === "number") setTotal(data.total);
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, token, wishes.length]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormOk(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/g/${encodeURIComponent(token)}/wishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(
          typeof data.error === "string"
            ? data.error
            : "Could not send your wish."
        );
        return;
      }
      if (data.item) {
        setWishes((prev) => [data.item as WishItem, ...prev]);
        setTotal((t) => t + 1);
        setShowWishes(true);
      }
      setName("");
      setMessage("");
      setErrors({});
      setFormOk("Thank you — your wish was added.");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="g3d-wishes" aria-labelledby="best-wishes-heading">
      <div className="g3d-wishes-header">
        <p className="g3d-wishes-eyebrow">Guest book</p>
        <h2 id="best-wishes-heading" className="g3d-wishes-title">
          Best Wishes
        </h2>
        <p className="g3d-wishes-desc">
          Leave a kind note for the couple — your message will appear below.
        </p>
      </div>

      <form className="g3d-wishes-card" onSubmit={onSubmit} noValidate>
        <div className="g3d-wishes-field">
          <label htmlFor="wish-name" className="g3d-wishes-label">
            Name <span aria-hidden>*</span>
          </label>
          <input
            id="wish-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
            }}
            className={`g3d-wishes-input${errors.name ? " is-invalid" : ""}`}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "wish-name-err" : undefined}
          />
          {errors.name ? (
            <p id="wish-name-err" className="g3d-wishes-field-err" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="g3d-wishes-field">
          <label htmlFor="wish-message" className="g3d-wishes-label">
            Your message / wish <span aria-hidden>*</span>
          </label>
          <textarea
            id="wish-message"
            name="message"
            rows={4}
            maxLength={800}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errors.message)
                setErrors((x) => ({ ...x, message: undefined }));
            }}
            className={`g3d-wishes-textarea${errors.message ? " is-invalid" : ""}`}
            placeholder="Write your best wishes…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "wish-message-err" : undefined}
          />
          {errors.message ? (
            <p
              id="wish-message-err"
              className="g3d-wishes-field-err"
              role="alert"
            >
              {errors.message}
            </p>
          ) : null}
          <p className="g3d-wishes-count">{message.trim().length}/800</p>
        </div>

        {formError ? (
          <p className="g3d-wishes-banner is-err" role="alert">
            {formError}
          </p>
        ) : null}
        {formOk ? (
          <p className="g3d-wishes-banner is-ok" role="status">
            {formOk}
          </p>
        ) : null}

        <button
          type="submit"
          className="g3d-wishes-submit"
          disabled={!canSubmit}
        >
          {submitting ? "Sending…" : "Submit Wish"}
        </button>
      </form>

      <div className="g3d-wishes-toggle-wrap">
        <button
          type="button"
          className={`g3d-wishes-toggle${showWishes ? " is-open" : ""}`}
          onClick={() => setShowWishes((v) => !v)}
          aria-expanded={showWishes}
          aria-controls="g3d-wishes-wall"
        >
          <span className="g3d-wishes-toggle-label">
            {showWishes ? "Hide wishes" : "Show wishes"}
          </span>
          <span className="g3d-wishes-toggle-count">
            {total} {total === 1 ? "wish" : "wishes"}
          </span>
          <svg
            className="g3d-wishes-toggle-chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {showWishes ? (
        <div
          id="g3d-wishes-wall"
          className="g3d-wishes-wall is-visible"
          role="region"
          aria-label="All wishes"
        >
          {total === 0 ? (
            <p className="g3d-wishes-empty">
              No wishes yet — be the first to leave a note.
            </p>
          ) : (
            <>
              <ul className="g3d-wishes-grid">
                {wishes.map((w) => (
                  <li key={w.id} className="g3d-wish-card">
                    <p className="g3d-wish-message">{w.message}</p>
                    <div className="g3d-wish-meta">
                      <span className="g3d-wish-name">{w.author_name}</span>
                      <time className="g3d-wish-time" dateTime={w.created_at}>
                        {formatWishTime(w.created_at)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
              {hasMore ? (
                <div className="g3d-wishes-load-more">
                  <button
                    type="button"
                    className="g3d-wishes-load-btn"
                    disabled={loadingMore}
                    onClick={loadMore}
                  >
                    {loadingMore
                      ? "Loading…"
                      : `Load more (${wishes.length} of ${total})`}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}
