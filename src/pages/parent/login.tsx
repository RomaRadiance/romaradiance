import type { GetServerSideProps } from "next";

import { ParentLoginForm } from "@/components/auth/parent-login-form";
import { PublicHead } from "@/components/seo/public-head";
import { redirectAuthenticatedLoginPage } from "@/lib/auth-pages";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = await redirectAuthenticatedLoginPage(context, "parent", "/parent");

  if (redirect) {
    return redirect;
  }

  return { props: {} };
};

export default function ParentLoginPage() {
  return (
    <>
      <PublicHead locale="en" pathname="/parent/login" title="Roma Tuition Parent Login" description="Sign in to the Roma Tuition parent area." noIndex localized={false} />
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff9ea_0%,#fff7da_40%,#f3fbff_100%)] px-4 py-10 text-slate-900">
        <div className="mx-auto max-w-md rounded-[2rem] border-[3px] border-slate-900 bg-white p-8 shadow-[0_10px_0_0_#173256]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Parent login</p>
          <h1 className="mt-3 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
            Open the private gallery
          </h1>
          <p className="mt-3 text-slate-700">
            Use the invited parent email address. We will send a secure magic link to sign you in.
          </p>
          <div className="mt-8">
            <ParentLoginForm />
          </div>
        </div>
      </main>
    </>
  );
}
