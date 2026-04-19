import type { GetServerSideProps } from "next";

import { AboutShell } from "@/components/public-site/about-shell";
import { PublicHead } from "@/components/seo/public-head";
import { isValidLocale } from "@/lib/public-site-content";
import { getOfferingsForPage, getSiteContentForPage, getSiteSettingsForPage } from "@/lib/site-pages";
import type { Locale, Offering, SiteContent, SiteSettings } from "@/lib/types";

type AboutPageProps = {
  locale: Locale;
  content: SiteContent;
  settings: SiteSettings;
  offerings: Offering[];
};

export const getServerSideProps: GetServerSideProps<AboutPageProps> = async (context) => {
  const localeParam = context.params?.locale;

  if (typeof localeParam !== "string" || !isValidLocale(localeParam)) {
    return { notFound: true };
  }

  const [content, settings, offerings] = await Promise.all([
    getSiteContentForPage(context),
    getSiteSettingsForPage(context),
    getOfferingsForPage(context),
  ]);

  return {
    props: {
      locale: localeParam,
      content,
      settings,
      offerings: offerings.filter((item) => item.active),
    },
  };
};

export default function AboutPage({ locale, content, settings, offerings }: AboutPageProps) {
  return (
    <>
      <PublicHead
        locale={locale}
        pathname="/about"
        title={locale === "hi" ? "Roma Tuition | परिचय / संपर्क" : "Roma Tuition | About / Contact"}
        description={locale === "hi" ? content.aboutIntroHi : content.aboutIntroEn}
      />
      <AboutShell
        locale={locale}
        pathname={`/${locale}/about`}
        content={content}
        settings={settings}
        offerings={offerings}
      />
    </>
  );
}
