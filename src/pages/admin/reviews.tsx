import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getAllReviewsForPage } from "@/lib/site-pages";
import type { Review } from "@/lib/types";

type AdminReviewsPageProps = {
  reviews: Review[];
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminReviewsPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminReviewsPageProps>;
  }

  return {
    props: {
      reviews: await getAllReviewsForPage(context),
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminReviewsPage({ reviews, message }: AdminReviewsPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/reviews" title="Roma Tuition Admin Reviews" description="Moderate parent reviews." noIndex localized={false} />
      <AdminShell
        title="Review moderation"
        description="All public reviews are submitted as pending and need approval before they appear on locale pages."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <section className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
                    {review.publicDisplayName}
                  </h3>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {review.locale.toUpperCase()} • {review.status}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-slate-700">{review.reviewText}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action="/api/admin/reviews/status" method="post">
                  <input type="hidden" name="id" value={review.id} />
                  <button name="status" value="approved" type="submit" className="cta-button cta-primary">
                    Approve
                  </button>
                </form>
                <form action="/api/admin/reviews/status" method="post">
                  <input type="hidden" name="id" value={review.id} />
                  <button name="status" value="rejected" type="submit" className="cta-button cta-secondary">
                    Reject
                  </button>
                </form>
              </div>
            </article>
          ))}
        </section>
      </AdminShell>
    </>
  );
}
