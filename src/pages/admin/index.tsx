import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import {
  getAllReviewsForPage,
  getGalleryItemsForPage,
  getOfferingsForPage,
  getParentInvitesForPage,
  getSiteSettingsForPage,
  getWhyChooseItemsForPage,
} from "@/lib/site-pages";

type AdminOverviewPageProps = {
  stats: { label: string; value: number | string }[];
};

export const getServerSideProps: GetServerSideProps<AdminOverviewPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminOverviewPageProps>;
  }

  const [settings, offerings, whyChoose, reviews, invites, gallery] = await Promise.all([
    getSiteSettingsForPage(context),
    getOfferingsForPage(context),
    getWhyChooseItemsForPage(context),
    getAllReviewsForPage(context),
    getParentInvitesForPage(context),
    getGalleryItemsForPage(context),
  ]);

  return {
    props: {
      stats: [
        { label: "Offerings", value: offerings.length },
        { label: "Why Choose items", value: whyChoose.length },
        { label: "Pending reviews", value: reviews.filter((item) => item.status === "pending").length },
        { label: "Parent invites", value: invites.length },
        { label: "Gallery items", value: gallery.length },
        { label: "Gallery enabled", value: settings.galleryEnabled ? "Yes" : "No" },
      ],
    },
  };
};

export default function AdminOverviewPage({ stats }: AdminOverviewPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin" title="Roma Tuition Admin" description="Roma Tuition admin overview." noIndex localized={false} />
      <AdminShell
        title="Overview"
        description="Track core content, moderation, invites, and gallery visibility from one place."
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <article
              key={item.label}
              className="rounded-[1.5rem] border-[3px] border-slate-900 bg-sky-50 p-5 shadow-[4px_4px_0_0_#173256]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-4xl font-black">{item.value}</p>
            </article>
          ))}
        </section>
      </AdminShell>
    </>
  );
}
