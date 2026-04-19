"use client";

import { useState } from "react";

import type { Locale } from "@/lib/types";

type ReviewSubmissionFormProps = {
  locale: Locale;
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    parentName: string;
    reviewText: string;
    submit: string;
  };
};

export function ReviewSubmissionForm({ locale, labels }: ReviewSubmissionFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent_name: form.get("parent_name"),
        review_text: form.get("review_text"),
        website: form.get("website"),
        locale,
      }),
    });

    const result = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setStatus(result?.message || "Something went wrong.");
      setSubmitting(false);
      return;
    }

    event.currentTarget.reset();
    setStatus(result?.message || "Review submitted for moderation.");
    setSubmitting(false);
  }

  return (
    <div className="section-shell" style={{ marginTop: "1.5rem", padding: "1.5rem" }}>
      <div className="section-heading">
        <span className="eyebrow-chip">{labels.eyebrow}</span>
        <h3 className="section-title" style={{ fontSize: "clamp(1.65rem, 4vw, 2.4rem)" }}>
          {labels.title}
        </h3>
        <p className="section-copy">{labels.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 md:col-span-1">
          {labels.parentName}
          <input
            name="parent_name"
            required
            maxLength={80}
            className="rounded-2xl border-[3px] border-slate-800 bg-white px-4 py-3 shadow-[4px_4px_0_0_#173256] outline-none"
          />
        </label>

        <label className="sr-only" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800 md:col-span-2">
          {labels.reviewText}
          <textarea
            name="review_text"
            required
            minLength={20}
            maxLength={600}
            rows={5}
            className="rounded-[1.5rem] border-[3px] border-slate-800 bg-white px-4 py-3 shadow-[4px_4px_0_0_#173256] outline-none"
          />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="cta-button cta-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (locale === "hi" ? "भेजा जा रहा है..." : "Submitting...") : labels.submit}
          </button>
          {status ? <p className="text-sm font-semibold text-slate-700">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}
