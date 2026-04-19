import type { GetServerSideProps } from "next";
import Link from "next/link";

import { PublicHead } from "@/components/seo/public-head";

type AuthErrorPageProps = {
  message: string;
};

export const getServerSideProps: GetServerSideProps<AuthErrorPageProps> = async ({ query }) => {
  return {
    props: {
      message: typeof query.message === "string" ? query.message : "Authentication failed.",
    },
  };
};

export default function AuthErrorPage({ message }: AuthErrorPageProps) {
  return (
    <>
      <PublicHead locale="en" pathname="/auth/error" title="Roma Tuition Auth Error" description={message} noIndex localized={false} />
      <main className="min-h-screen bg-[linear-gradient(180deg,#fff9ea_0%,#fff7da_40%,#f3fbff_100%)] px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-xl rounded-[2rem] border-[3px] border-slate-900 bg-white p-8 shadow-[0_10px_0_0_#173256]">
          <p className="eyebrow-chip">Sign-in issue</p>
          <h1 className="mt-4 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
            We could not complete your sign-in.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{message}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/parent/login" className="cta-button cta-primary">
              Parent login
            </Link>
            <Link href="/admin/login" className="cta-button cta-secondary">
              Admin login
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
