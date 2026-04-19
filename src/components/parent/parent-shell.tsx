import Link from "next/link";

type ParentShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function ParentShell({ title, description, children }: ParentShellProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff9ea_0%,#fff7da_40%,#f3fbff_100%)] px-4 py-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[2rem] border-[3px] border-slate-900 bg-white p-6 shadow-[0_10px_0_0_#173256]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Parent area</p>
              <h1 className="mt-2 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-slate-700">{description}</p>
            </div>

            <nav className="flex flex-wrap gap-3">
              <Link href="/parent" className="nav-link">
                Overview
              </Link>
              <Link href="/parent/gallery" className="nav-link">
                Gallery
              </Link>
            </nav>
          </div>

          <form action="/api/auth/sign-out" method="post" className="mt-4">
            <button type="submit" className="cta-button cta-secondary">
              Sign out
            </button>
          </form>
        </header>

        {children}
      </div>
    </div>
  );
}
