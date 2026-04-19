import type { GetServerSideProps } from "next";

import { LOCALE_COOKIE_NAME, pickPreferredLocale } from "@/lib/i18n";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const locale = pickPreferredLocale(req.cookies[LOCALE_COOKIE_NAME], req.headers["accept-language"] || null);

  return {
    redirect: {
      destination: `/${locale}`,
      permanent: false,
    },
  };
};

export default function RootRedirectPage() {
  return null;
}
