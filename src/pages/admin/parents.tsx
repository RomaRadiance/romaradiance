import type { GetServerSideProps, GetServerSidePropsResult } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { PublicHead } from "@/components/seo/public-head";
import { requireRolePage } from "@/lib/auth-pages";
import { getParentInvitesForPage, getProfilesForPage } from "@/lib/site-pages";
import type { ParentInvite, Profile } from "@/lib/types";

type AdminParentsPageProps = {
  invites: ParentInvite[];
  profiles: Profile[];
  message: string | null;
};

export const getServerSideProps: GetServerSideProps<AdminParentsPageProps> = async (context) => {
  const guard = await requireRolePage(context, "admin", "/admin/login");

  if ("redirect" in guard || "notFound" in guard) {
    return guard as GetServerSidePropsResult<AdminParentsPageProps>;
  }

  const [invites, profiles] = await Promise.all([
    getParentInvitesForPage(context),
    getProfilesForPage(context),
  ]);

  return {
    props: {
      invites,
      profiles,
      message: typeof context.query.message === "string" ? context.query.message : null,
    },
  };
};

export default function AdminParentsPage({ invites, profiles, message }: AdminParentsPageProps) {
  const parentProfiles = profiles.filter((profile) => profile.role === "parent");

  return (
    <>
      <PublicHead locale="en" pathname="/admin/parents" title="Roma Tuition Admin Parents" description="Manage parent invites and access." noIndex localized={false} />
      <AdminShell
        title="Parent access"
        description="Track invited parents, activation state, and linked auth profiles for gallery access."
      >
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        <form action="/api/admin/parents/invite" method="post" className="grid gap-3 rounded-[1.5rem] border-[3px] border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_0_#173256] md:grid-cols-3">
          <input name="displayName" placeholder="Parent display name" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <input name="email" type="email" placeholder="parent@example.com" className="rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3" />
          <button type="submit" className="cta-button cta-primary justify-center">Invite parent</button>
        </form>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              Invites
            </h3>
            {invites.length === 0 ? (
              <p className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-white p-5">
                No parent invites yet.
              </p>
            ) : (
              invites.map((invite) => (
                <article
                  key={invite.id}
                  className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
                >
                  <p className="text-xl font-black">{invite.displayName}</p>
                  <p className="mt-2 text-slate-700">{invite.email}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action="/api/admin/parents/invite" method="post">
                      <input type="hidden" name="id" value={invite.id} />
                      <input type="hidden" name="displayName" value={invite.displayName} />
                      <input type="hidden" name="email" value={invite.email} />
                      <button type="submit" className="cta-button cta-primary">Resend</button>
                    </form>
                    <form action="/api/admin/parents/toggle-invite" method="post">
                      <input type="hidden" name="id" value={invite.id} />
                      <input type="hidden" name="active" value={invite.active ? "false" : "true"} />
                      <button type="submit" className="cta-button cta-secondary">
                        {invite.active ? "Deactivate" : "Activate"}
                      </button>
                    </form>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              Profiles
            </h3>
            {parentProfiles.length === 0 ? (
              <p className="rounded-[1.5rem] border-[3px] border-dashed border-slate-900 bg-white p-5">
                No parent profiles yet.
              </p>
            ) : (
              parentProfiles.map((profile) => (
                <article
                  key={profile.userId}
                  className="rounded-[1.5rem] border-[3px] border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#173256]"
                >
                  <p className="text-xl font-black">{profile.displayName}</p>
                  <p className="mt-2 text-slate-700">{profile.email}</p>
                  <form action="/api/admin/parents/toggle-profile" method="post" className="mt-4">
                    <input type="hidden" name="userId" value={profile.userId} />
                    <input type="hidden" name="active" value={profile.active ? "false" : "true"} />
                    <button type="submit" className="cta-button cta-secondary">
                      {profile.active ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </article>
              ))
            )}
          </div>
        </section>
      </AdminShell>
    </>
  );
}
