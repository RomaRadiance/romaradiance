import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { ParentShell } from "@/components/parent/parent-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getSiteSettingsForPage } from "@/lib/site-pages";
import type { SiteSettings } from "@/lib/types";

type ParentOverviewPageProps = {
  settings: SiteSettings;
};

export const getServerSideProps: GetServerSideProps<ParentOverviewPageProps> = async (context) => {
  const guard = await requireRolePage(context, "parent", "/parent/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<ParentOverviewPageProps>;
  }

  const settings = await getSiteSettingsForPage(context);

  return {
    props: {
      settings,
    },
  };
};

export default function ParentOverviewPage({ settings }: ParentOverviewPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/parent" title="Roma Tuition Parent Area" description="Private parent area for Roma Tuition." noIndex localized={false} />
      <ParentShell
        title="Welcome to the parent area"
        description="Your login gives access only to the private shared gallery when the admin has enabled it."
      >
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Gallery status</p>
            <p className="mt-3 text-3xl font-black">{settings.galleryEnabled ? "Enabled" : "Locked"}</p>
          </article>
          <article className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Support phone</p>
            <a href={`tel:+91${settings.phone}`} className="mt-3 block text-3xl font-black">
              {settings.phone}
            </a>
          </article>
        </section>
      </ParentShell>
    </>
  );
}
