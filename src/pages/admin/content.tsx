import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getSiteContentForPage } from "@/lib/site-pages";
import type { SiteContent } from "@/lib/types";

type AdminContentPageProps = {
  content: SiteContent;
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminContentPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminContentPageProps>;
  }

  return {
    props: {
      content: await getSiteContentForPage(context),
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminContentPage({ content, message }: AdminContentPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/content" title="Roma Tuition Admin Content" description="Manage bilingual site content." noIndex localized={false} />
      <AdminShell
        title="Content"
        description="Bilingual hero, about, contact, and gallery teaser content managed through structured fields."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <form action="/api/admin/content" method="post" className="grid gap-4 md:grid-cols-2">
          {Object.entries(content).map(([key, value]) => (
            <label
              key={key}
              className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{key}</span>
              {String(value).length > 80 ? (
                <textarea
                  name={key}
                  defaultValue={String(value)}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border-[3px] border-slate-900 px-4 py-3"
                />
              ) : (
                <input
                  name={key}
                  defaultValue={String(value)}
                  className="mt-3 w-full rounded-2xl border-[3px] border-slate-900 px-4 py-3"
                />
              )}
            </label>
          ))}
          <div className="md:col-span-2">
            <button type="submit" className="cta-button cta-primary">Save content</button>
          </div>
        </form>
      </AdminShell>
    </>
  );
}
