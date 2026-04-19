import Link from "next/link";

import { getLocaleSwitcherPath } from "@/lib/public-site-content";
import type { Locale } from "@/lib/types";

type HeaderLink = {
  href: string;
  label: string;
  isAnchor?: boolean;
};

type PublicSiteHeaderProps = {
  locale: Locale;
  pathname: string;
  localeLabel: string;
  switcherLabel: string;
  announcement: string;
  links: HeaderLink[];
};

export function PublicSiteHeader({
  locale,
  pathname,
  localeLabel,
  switcherLabel,
  announcement,
  links,
}: PublicSiteHeaderProps) {
  return (
    <header className="top-banner">
      <div className="announcement-pill">
        <span className="spark-dot" aria-hidden="true" />
        {announcement}
      </div>

      <div className="nav-shell">
        <Link href={`/${locale}`} className="brand-mark" aria-label="Roma Tuition home">
          <span className="brand-badge">RT</span>
          <span>
            <strong>Roma Tuition</strong>
            <small>{localeLabel}</small>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary navigation">
          {links.map((item) =>
            item.isAnchor ? (
              <a key={`${item.href}-${item.label}`} href={item.href} className="nav-link">
                {item.label}
              </a>
            ) : (
              <Link key={`${item.href}-${item.label}`} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Link href={getLocaleSwitcherPath(locale, pathname)} className="locale-switch">
          {switcherLabel}
        </Link>
      </div>
    </header>
  );
}
