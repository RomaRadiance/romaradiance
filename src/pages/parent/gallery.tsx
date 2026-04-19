import type { GetServerSideProps, GetServerSidePropsResult } from "next";
import Image from "next/image";

import { ParentShell } from "@/components/parent/parent-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getSignedGalleryItemsForPage, getSiteSettingsForPage } from "@/lib/site-pages";
import type { GalleryViewItem, SiteSettings } from "@/lib/types";

type ParentGalleryPageProps = {
  settings: SiteSettings;
  items: GalleryViewItem[];
};

export const getServerSideProps: GetServerSideProps<ParentGalleryPageProps> = async (context) => {
  const guard = await requireRolePage(context, "parent", "/parent/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<ParentGalleryPageProps>;
  }

  const [settings, items] = await Promise.all([
    getSiteSettingsForPage(context),
    getSignedGalleryItemsForPage(context, "en"),
  ]);

  return {
    props: {
      settings,
      items,
    },
  };
};

export default function ParentGalleryPage({ settings, items }: ParentGalleryPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/parent/gallery" title="Roma Tuition Private Gallery" description="Private parent gallery." noIndex localized={false} />
      <ParentShell
        title="Private gallery"
        description="Visible only to active invited parents and admins. Signed image links are short-lived and never public."
      >
        {!settings.galleryEnabled ? (
          <section className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-6 shadow-[4px_4px_0_0_#173256]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Gallery locked</p>
            <p className="mt-3 text-lg text-slate-700">
              The admin has currently disabled the parent gallery. Please check back later.
            </p>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.length === 0 ? (
              <article className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-white p-6 text-slate-700">
                No gallery images uploaded yet.
              </article>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.5rem] border-[3px] border-slate-900 bg-white shadow-[4px_4px_0_0_#173256]"
                >
                  <div className="relative h-64 bg-slate-100">
                    {item.signedUrl ? (
                      <Image src={item.signedUrl} alt={item.altText} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full items-center justify-center p-6 text-center text-slate-500">
                        Secure gallery image will appear here after Supabase storage is configured.
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {item.displayDate || "Private image"}
                    </p>
                    <p className="text-slate-700">{item.caption || "Roma Tuition gallery moment"}</p>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </ParentShell>
    </>
  );
}
