import Head from "next/head";

import type { Locale } from "@/lib/types";
import { getOptionalSiteUrl } from "@/lib/env";
import { buildLocalizedPath, locales } from "@/lib/i18n";

type PublicHeadProps = {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
  noIndex?: boolean;
  localized?: boolean;
};

export function PublicHead({
  locale,
  pathname,
  title,
  description,
  noIndex = false,
  localized = true,
}: PublicHeadProps) {
  const siteUrl = getOptionalSiteUrl();
  const canonicalPath = localized ? buildLocalizedPath(locale, pathname) : pathname;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={`${siteUrl}${canonicalPath}`} />
      {localized
        ? locales.map((item) => (
            <link
              key={item}
              rel="alternate"
              hrefLang={item}
              href={`${siteUrl}${buildLocalizedPath(item, pathname)}`}
            />
          ))
        : null}
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
    </Head>
  );
}
