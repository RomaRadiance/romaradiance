import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getGalleryItemsForPage } from "@/lib/site-pages";
import type { GalleryItem } from "@/lib/types";

type AdminGalleryPageProps = {
  items: GalleryItem[];
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminGalleryPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminGalleryPageProps>;
  }

  return {
    props: {
      items: await getGalleryItemsForPage(context),
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminGalleryPage({ items, message }: AdminGalleryPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/gallery" title="Roma Tuition Admin Gallery" description="Manage private gallery items." noIndex localized={false} />
      <AdminShell
        title="Gallery management"
        description="Private parent gallery assets stay in a non-public bucket and are signed only for authorized users."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <form action="/api/admin/gallery/upload" method="post" encType="multipart/form-data" className="grid gap-3 rounded-[1.5rem] border-[3px] border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_0_#173256] md:grid-cols-2">
          <h3 className="md:col-span-2 text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
            Upload gallery image
          </h3>
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="displayDate" type="date" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="captionEn" placeholder="Caption (EN)" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="captionHi" placeholder="Caption (HI)" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="altTextEn" placeholder="Alt text (EN)" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="altTextHi" placeholder="Alt text (HI)" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="sortOrder" type="number" defaultValue={0} className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <label className="flex items-center gap-2 font-semibold">
            <input name="active" type="checkbox" defaultChecked /> Active
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="cta-button cta-primary">Upload image</button>
          </div>
        </form>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? (
            <article className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-white p-6 text-slate-700">
              No gallery items yet. Upload management is ready for Supabase-backed media.
            </article>
          ) : (
            items.map((item) => (
              <form
                key={item.id}
                action="/api/admin/gallery/update"
                method="post"
                className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
              >
                <input type="hidden" name="id" value={item.id} />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{item.storagePath}</p>
                <div className="mt-3 grid gap-3">
                  <input name="captionEn" defaultValue={item.captionEn || ""} placeholder="Caption (EN)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="captionHi" defaultValue={item.captionHi || ""} placeholder="Caption (HI)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="altTextEn" defaultValue={item.altTextEn || ""} placeholder="Alt text (EN)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="altTextHi" defaultValue={item.altTextHi || ""} placeholder="Alt text (HI)" className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="displayDate" type="date" defaultValue={item.displayDate || ""} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
                  <label className="flex items-center gap-2 font-semibold">
                    <input name="active" type="checkbox" defaultChecked={item.active} /> Active
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="cta-button cta-primary">Save</button>
                    <button formAction="/api/admin/gallery/delete" className="cta-button cta-secondary">Delete</button>
                  </div>
                </div>
              </form>
            ))
          )}
        </section>
      </AdminShell>
    </>
  );
}
