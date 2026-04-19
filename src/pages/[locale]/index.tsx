import type { GetServerSideProps } from "next";

import { PublicHead } from "@/components/seo/public-head";
import { MarketingShell } from "@/components/public-site/marketing-shell";
import { getPublicHomeDataForPage } from "@/lib/site-pages";
import { isValidLocale } from "@/lib/public-site-content";
import type { Locale, PublicHomeData } from "@/lib/types";

type LocaleHomePageProps = {
  locale: Locale;
  data: PublicHomeData;
};

export const getServerSideProps: GetServerSideProps<LocaleHomePageProps> = async (context) => {
  const localeParam = context.params?.locale;

  if (typeof localeParam !== "string" || !isValidLocale(localeParam)) {
    return { notFound: true };
  }

  const data = await getPublicHomeDataForPage(context, localeParam);

  return {
    props: {
      locale: localeParam,
      data,
    },
  };
};

export default function LocaleHomePage({ locale, data }: LocaleHomePageProps) {
  return (
    <>
      <PublicHead
        locale={locale}
        pathname="/"
        title={locale === "hi" ? "Roma Tuition | बच्चों के लिए bilingual tuition" : "Roma Tuition | Bright bilingual tuition support"}
        description={locale === "hi" ? data.content.heroSubtitleHi : data.content.heroSubtitleEn}
      />
      <MarketingShell locale={locale} pathname={`/${locale}`} data={data} />
    </>
  );
}
