import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff9ea_0%,#fff7da_40%,#f3fbff_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-xl rounded-[2rem] border-[3px] border-slate-900 bg-white p-8 shadow-[0_10px_0_0_#173256]">
        <p className="eyebrow-chip">404</p>
        <h1 className="mt-4 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
          Page not found.
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          We could not find that page. Please return to the public site.
        </p>
        <Link href="/en" className="cta-button cta-primary mt-8 inline-flex">
          Go to home
        </Link>
      </div>
    </main>
  );
}
