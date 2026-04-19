import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getSiteSettingsForPage } from "@/lib/site-pages";
import type { SiteSettings } from "@/lib/types";

type AdminSettingsPageProps = {
  settings: SiteSettings;
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminSettingsPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminSettingsPageProps>;
  }

  return {
    props: {
      settings: await getSiteSettingsForPage(context),
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminSettingsPage({ settings, message }: AdminSettingsPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/settings" title="Roma Tuition Admin Settings" description="Manage global site settings." noIndex localized={false} />
      <AdminShell
        title="Site settings"
        description="Global phone-first contact settings and gallery visibility controls."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <form action="/api/admin/settings" method="post" className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Phone</span>
            <input name="phone" defaultValue={settings.phone} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
          </label>
          <label className="grid gap-2 rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">WhatsApp</span>
            <input name="whatsapp" defaultValue={settings.whatsapp || ""} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
          </label>
          <label className="grid gap-2 rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Address</span>
            <input name="address" defaultValue={settings.address || ""} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
          </label>
          <label className="grid gap-2 rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Hours</span>
            <input name="hours" defaultValue={settings.hours || ""} className="rounded-2xl border-[3px] border-slate-900 px-4 py-3" />
          </label>
          <label className="md:col-span-2 flex items-center gap-3 rounded-[1.5rem] border-[3px] border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_0_#173256] font-semibold">
            <input name="galleryEnabled" type="checkbox" defaultChecked={settings.galleryEnabled} /> Enable parent gallery globally
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="cta-button cta-primary">Save settings</button>
          </div>
        </form>
      </AdminShell>
    </>
  );
}
