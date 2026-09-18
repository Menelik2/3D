"use client";

import { FormEvent, useMemo, useState } from "react";
import "@/app/gallery-wishes.css";

export type WishItem = {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
};

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
}: {
  token: string;
  initialWishes?: WishItem[];
}) {
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; message?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formOk, setFormOk] = useState<string | null>(null);

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
          typeof data.error === "string" ? data.error : "Could not send your wish."
        );
        return;
      }
      if (data.item) {
        setWishes((prev) => [data.item as WishItem, ...prev]);
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

      <div className="g3d-wishes-wall">
        {wishes.length === 0 ? (
          <p className="g3d-wishes-empty">
            No wishes yet — be the first to leave a note.
          </p>
        ) : (
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
        )}
      </div>
    </section>
  );
}
