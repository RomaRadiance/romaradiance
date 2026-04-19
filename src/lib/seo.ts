import type { Metadata } from "next";

import { buildLocalizedPath, locales } from "@/lib/i18n";
import { getOptionalSiteUrl } from "@/lib/env";
import type { Locale } from "@/lib/types";

export function buildLocaleMetadata({
  locale,
  pathname,
  title,
  description,
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description: string;
}): Metadata {
  const siteUrl = getOptionalSiteUrl();
  const localizedPath = buildLocalizedPath(locale, pathname);

  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(
        locales.map((item) => [item, `${siteUrl}${buildLocalizedPath(item, pathname)}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${localizedPath}`,
      type: "website",
    },
  };
}
