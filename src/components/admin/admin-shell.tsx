import Link from "next/link";

type AdminShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/offerings", label: "Offerings" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/parents", label: "Parents" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({ title, description, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:px-6">
        <aside className="rounded-[2rem] border-[3px] border-slate-900 bg-white p-5 shadow-[0_10px_0_0_#173256]">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Roma admin</p>
            <h1 className="mt-2 text-3xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              Control room
            </h1>
          </div>

          <nav className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border-[2px] border-slate-900 bg-slate-50 px-4 py-3 font-semibold shadow-[4px_4px_0_0_#173256] transition hover:-translate-y-0.5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/api/auth/sign-out" method="post" className="mt-6">
            <button type="submit" className="w-full rounded-2xl border-[2px] border-slate-900 bg-rose-100 px-4 py-3 font-semibold shadow-[4px_4px_0_0_#173256] transition hover:-translate-y-0.5">
              Sign out
            </button>
          </form>
        </aside>

        <main className="space-y-6 rounded-[2rem] border-[3px] border-slate-900 bg-white p-6 shadow-[0_10px_0_0_#173256]">
          <header className="rounded-[1.5rem] border-[3px] border-slate-900 bg-amber-100 p-5 shadow-[4px_4px_0_0_#173256]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Dashboard</p>
            <h2 className="mt-2 text-4xl font-black" style={{ fontFamily: "var(--font-heading), cursive" }}>
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700">{description}</p>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
