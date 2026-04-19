import type { GetServerSideProps } from "next";

import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { PublicHead } from "@/components/seo/public-head";
import { redirectAuthenticatedLoginPage } from "@/lib/auth-pages";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await redirectAuthenticatedLoginPage(context, "admin", "/admin");

  if (redirect) {
    return redirect;
  }

  return { props: {} };
};

export default function AdminLoginPage() {
  return (
    <>
      <PublicHead locale="en" pathname="/admin/login" title="Roma Tuition Admin Login" description="Sign in to the Roma Tuition admin area." noIndex localized={false} />
      <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-md rounded-[2rem] border-[3px] border-slate-900 bg-white p-8 shadow-[0_10px_0_0_#173256]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Admin login</p>
          <h1 className="mt-3 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
            Sign in to Roma admin
          </h1>
          <p className="mt-3 text-slate-700">Use the seeded admin email and password configured in Supabase.</p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
