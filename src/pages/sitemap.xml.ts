import type { GetServerSideProps } from "next";

import { getOptionalSiteUrl } from "@/lib/env";

const locales = ["en", "hi"] as const;
const publicPaths = ["", "/about"] as const;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const siteUrl = getOptionalSiteUrl();
  const urls = publicPaths.flatMap((path) => locales.map((locale) => `${siteUrl}/${locale}${path}`));
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join("\n")}\n</urlset>`;

  res.setHeader("Content-Type", "application/xml");
  res.write(content);
  res.end();

  return { props: {} };
};

export default function SitemapPage() {
  return null;
}
