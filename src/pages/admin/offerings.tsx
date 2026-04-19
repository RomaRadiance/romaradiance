import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getOfferingsForPage, getWhyChooseItemsForPage } from "@/lib/site-pages";
import type { Offering, WhyChooseItem } from "@/lib/types";

type AdminOfferingsPageProps = {
  offerings: Offering[];
  whyChoose: WhyChooseItem[];
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminOfferingsPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminOfferingsPageProps>;
  }

  const [offerings, whyChoose] = await Promise.all([
    getOfferingsForPage(context),
    getWhyChooseItemsForPage(context),
  ]);

  return {
    props: {
      offerings,
      whyChoose,
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminOfferingsPage({ offerings, whyChoose, message }: AdminOfferingsPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/offerings" title="Roma Tuition Admin Offerings" description="Manage offerings and trust-building content." noIndex localized={false} />
      <AdminShell
        title="Offerings and Why Choose Roma"
        description="Track seeded tuition offerings and the trust-building reasons shown on the public site."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              Offerings
            </h3>
            {offerings.map((item) => (
              <form
                key={item.id}
                action="/api/admin/offerings"
                method="post"
                className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-3">
                  <input name="titleEn" defaultValue={item.titleEn} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="titleHi" defaultValue={item.titleHi} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <textarea name="detailsEn" defaultValue={item.detailsEn} rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <textarea name="detailsHi" defaultValue={item.detailsHi} rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="scheduleEn" defaultValue={item.scheduleEn} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="scheduleHi" defaultValue={item.scheduleHi} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <div className="flex flex-wrap items-center gap-3">
                    <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                    <label className="flex items-center gap-2 font-semibold">
                      <input name="active" type="checkbox" defaultChecked={item.active} /> Active
                    </label>
                  </div>
                  <button type="submit" className="cta-button cta-primary">Save offering</button>
                </div>
              </form>
            ))}

            <form action="/api/admin/offerings" method="post" className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-amber-50 p-5">
              <h4 className="text-xl font-black">Add offering</h4>
              <div className="mt-4 grid gap-3">
                <input name="titleEn" placeholder="Title (EN)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="titleHi" placeholder="Title (HI)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <textarea name="detailsEn" placeholder="Details (EN)" rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <textarea name="detailsHi" placeholder="Details (HI)" rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="scheduleEn" placeholder="Schedule (EN)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="scheduleHi" placeholder="Schedule (HI)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="sortOrder" type="number" defaultValue={0} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <label className="flex items-center gap-2 font-semibold">
                  <input name="active" type="checkbox" defaultChecked /> Active
                </label>
                <button type="submit" className="cta-button cta-primary">Create offering</button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              Why Choose Roma
            </h3>
            {whyChoose.map((item) => (
              <form
                key={item.id}
                action="/api/admin/why-choose"
                method="post"
                className="rounded-[1.5rem] border-[3px] border-slate-900 bg-emerald-50 p-5 shadow-[4px_4px_0_0_#173256]"
              >
                <input type="hidden" name="id" value={item.id} />
                <div className="grid gap-3">
                  <input name="titleEn" defaultValue={item.titleEn} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="titleHi" defaultValue={item.titleHi} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <textarea name="descriptionEn" defaultValue={item.descriptionEn} rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <textarea name="descriptionHi" defaultValue={item.descriptionHi} rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <div className="flex flex-wrap items-center gap-3">
                    <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                    <label className="flex items-center gap-2 font-semibold">
                      <input name="active" type="checkbox" defaultChecked={item.active} /> Active
                    </label>
                  </div>
                  <button type="submit" className="cta-button cta-primary">Save reason</button>
                </div>
              </form>
            ))}

            <form action="/api/admin/why-choose" method="post" className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-sky-50 p-5">
              <h4 className="text-xl font-black">Add reason</h4>
              <div className="mt-4 grid gap-3">
                <input name="titleEn" placeholder="Title (EN)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="titleHi" placeholder="Title (HI)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <textarea name="descriptionEn" placeholder="Description (EN)" rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <textarea name="descriptionHi" placeholder="Description (HI)" rows={3} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <input name="sortOrder" type="number" defaultValue={0} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                <label className="flex items-center gap-2 font-semibold">
                  <input name="active" type="checkbox" defaultChecked /> Active
                </label>
                <button type="submit" className="cta-button cta-primary">Create reason</button>
              </div>
            </form>
          </div>
        </section>
      </AdminShell>
    </>
  );
}
