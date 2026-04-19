import type { GetServerSideProps } from "next";

import { getOptionalSiteUrl } from "@/lib/env";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = `User-Agent: *\nAllow: /en\nAllow: /en/about\nAllow: /hi\nAllow: /hi/about\nDisallow: /admin\nDisallow: /admin/\nDisallow: /parent\nDisallow: /parent/\nDisallow: /auth/\n\nSitemap: ${getOptionalSiteUrl()}/sitemap.xml\n`;

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();

  return { props: {} };
};

export default function RobotsPage() {
  return null;
}
