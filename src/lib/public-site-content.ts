import { getAlternateLocale, getLocalizedValue, isLocale, locales } from "@/lib/i18n";
import type { Locale, Offering, PublicHomeData, SiteContent, SiteSettings, WhyChooseItem } from "@/lib/types";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

type NavLink = {
  href: string;
  label: string;
};

type StaticMarketingContent = {
  localeLabel: string;
  switcherLabel: string;
  announcement: string;
  nav: NavLink[];
  heroEyebrow: string;
  heroHighlight: string;
  heroFeatureCards: { title: string; description: string }[];
  heroPosterLabel: string;
  heroPosterTitle: string;
  heroPosterBody: string;
  heroPosterRibbon: string;
  offeringsEyebrow: string;
  offeringsTitle: string;
  offeringsDescription: string;
  reasonsEyebrow: string;
  reasonsTitle: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviewsDescription: string;
  galleryEyebrow: string;
  galleryPreviewItems: { title: string; description: string }[];
  galleryEnabledText: string;
  galleryDisabledText: string;
  galleryParentCta: string;
  galleryLockedBadge: string;
  reviewFormEyebrow: string;
  reviewFormTitle: string;
  reviewFormDescription: string;
  reviewFormSubmit: string;
  reviewFormNameLabel: string;
  reviewFormTextLabel: string;
  aboutTitle: string;
  aboutEyebrow: string;
  aboutTeachingTitle: string;
  aboutOfferingTitle: string;
  contactEyebrow: string;
  footerNote: string;
};

export { locales };
export type { Locale };

const staticMarketingContent: Record<Locale, StaticMarketingContent> = {
  en: {
    localeLabel: "English",
    switcherLabel: "हिन्दी",
    announcement: "New term admissions open • joyful tuition for grades 1 to 8.",
    nav: [
      { href: "#offerings", label: "Offerings" },
      { href: "#why-us", label: "Why Roma" },
      { href: "#reviews", label: "Reviews" },
      { href: "#gallery", label: "Gallery" },
      { href: "#contact", label: "Contact" },
    ],
    heroEyebrow: "Teacher Roma • fun learning corner",
    heroHighlight: "young minds",
    heroFeatureCards: [
      {
        title: "Homework becomes calmer",
        description: "Step-by-step support that makes everyday schoolwork feel manageable.",
      },
      {
        title: "Stronger basics",
        description: "Reading, writing, maths, and concept practice that children can retain.",
      },
      {
        title: "Parents stay informed",
        description: "Simple updates on progress, routines, and where a child needs extra help.",
      },
    ],
    heroPosterLabel: "After-school joy",
    heroPosterTitle: "Read • Count • Shine",
    heroPosterBody:
      "Bright guidance for homework routines, concept clarity, and growing confidence.",
    heroPosterRibbon: "Bilingual help",
    offeringsEyebrow: "What children can learn",
    offeringsTitle: "Clear school support with cheerful daily practice",
    offeringsDescription:
      "Support is available for primary and middle-school learners through clear, well-structured tuition options.",
    reasonsEyebrow: "Why families choose Roma",
    reasonsTitle: "Patient teaching, steady routines, and child-friendly encouragement",
    reviewsEyebrow: "Parent reviews",
    reviewsTitle: "Only approved reviews appear here",
    reviewsDescription:
      "Reviews stay in the language they were submitted in and only show on the matching locale page.",
    galleryEyebrow: "Private parent gallery",
    galleryPreviewItems: [
      {
        title: "Reading circle",
        description: "Story cards, turn-taking, and gentle speaking confidence practice.",
      },
      {
        title: "Worksheet wall",
        description: "Bright revision prompts, stars, and neat concept-by-concept learning.",
      },
      {
        title: "Activity table",
        description: "Tracing, counting, sorting, and hands-on learning games.",
      },
    ],
    galleryEnabledText:
      "The gallery remains invite-only even when enabled. Public pages still do not show private images.",
    galleryDisabledText:
      "The gallery is private and can be turned off globally by the admin at any time.",
    galleryParentCta: "Parent login",
    galleryLockedBadge: "Invite-only",
    reviewFormEyebrow: "Share your feedback",
    reviewFormTitle: "Tell other parents what changed for your child",
    reviewFormDescription:
      "Reviews are moderated before they appear publicly. Only your first name will be shown.",
    reviewFormSubmit: "Submit review",
    reviewFormNameLabel: "Parent name",
    reviewFormTextLabel: "Your review",
    aboutTitle: "About Roma Tuition",
    aboutEyebrow: "Warm, phone-first support for growing learners",
    aboutTeachingTitle: "Teaching approach",
    aboutOfferingTitle: "Class summary",
    contactEyebrow: "Call now",
    footerNote: "Bilingual tuition support for growing learners and busy families.",
  },
  hi: {
    localeLabel: "हिन्दी",
    switcherLabel: "English",
    announcement: "नए बैचों में प्रवेश शुरू • कक्षा 1 से 8 तक खुशहाल पढ़ाई की सहायता।",
    nav: [
      { href: "#offerings", label: "क्लासेस" },
      { href: "#why-us", label: "क्यों चुनें Roma" },
      { href: "#reviews", label: "समीक्षाएँ" },
      { href: "#gallery", label: "गैलरी" },
      { href: "#contact", label: "संपर्क" },
    ],
    heroEyebrow: "Teacher Roma • मज़ेदार पढ़ाई का कोना",
    heroHighlight: "नन्हे विद्यार्थी",
    heroFeatureCards: [
      {
        title: "होमवर्क आसान लगता है",
        description: "एक-एक कदम की मदद से रोज़ का स्कूलवर्क आसान और संभालने योग्य लगता है।",
      },
      {
        title: "मज़बूत बुनियाद",
        description: "पढ़ना, लिखना, गणित और नियमित अभ्यास जो बच्चों की नींव मजबूत करे।",
      },
      {
        title: "माता-पिता को साफ जानकारी",
        description: "प्रगति, पढ़ाई के रूटीन और अतिरिक्त मदद की ज़रूरत पर साफ जानकारी।",
      },
    ],
    heroPosterLabel: "स्कूल के बाद खुशहाल पढ़ाई",
    heroPosterTitle: "पढ़ो • समझो • आगे बढ़ो",
    heroPosterBody: "होमवर्क, आसान समझ और आत्मविश्वास के लिए रंगीन सहयोग।",
    heroPosterRibbon: "दो भाषाओं में मदद",
    offeringsEyebrow: "बच्चे क्या सीखते हैं",
    offeringsTitle: "खुशहाल अभ्यास के साथ साफ और भरोसेमंद पढ़ाई की मदद",
    offeringsDescription:
      "बच्चों के लिए अलग-अलग कक्षाओं और विषयों के अनुसार साफ और व्यवस्थित tuition support उपलब्ध है।",
    reasonsEyebrow: "परिवार Roma क्यों चुनते हैं",
    reasonsTitle: "धैर्य, नियमित रूटीन और बच्चों के अनुकूल प्रोत्साहन",
    reviewsEyebrow: "माता-पिता की राय",
    reviewsTitle: "यहाँ केवल approved reviews दिखाई जाती हैं",
    reviewsDescription:
      "Reviews जिस भाषा में submit होती हैं, उसी भाषा के page पर approved होने के बाद दिखाई जाती हैं।",
    galleryEyebrow: "निजी अभिभावक गैलरी",
    galleryPreviewItems: [
      {
        title: "पढ़ने का घेरा",
        description: "कहानी कार्ड, बारी-बारी से भागीदारी और बोलने के आत्मविश्वास की सहज practice।",
      },
      {
        title: "वर्कशीट दीवार",
        description: "रंगीन revision prompts, stars और step-by-step सीखने की neat तैयारी।",
      },
      {
        title: "Activity table",
        description: "tracing, counting, sorting और hands-on learning games की मज़ेदार practice।",
      },
    ],
    galleryEnabledText:
      "चालू होने पर भी गैलरी सिर्फ invited parents के लिए रहती है। Public pages पर private images नहीं दिखतीं।",
    galleryDisabledText:
      "गैलरी private है और admin इसे कभी भी globally बंद कर सकता है।",
    galleryParentCta: "अभिभावक लॉगिन",
    galleryLockedBadge: "सिर्फ आमंत्रितों के लिए",
    reviewFormEyebrow: "अपनी राय साझा करें",
    reviewFormTitle: "दूसरे माता-पिता को बताइए कि आपके बच्चे में क्या बदला",
    reviewFormDescription:
      "आपकी राय public होने से पहले moderated की जाती है। सिर्फ पहला नाम दिखाया जाएगा।",
    reviewFormSubmit: "राय भेजें",
    reviewFormNameLabel: "अभिभावक का नाम",
    reviewFormTextLabel: "आपकी राय",
    aboutTitle: "Roma Tuition के बारे में",
    aboutEyebrow: "बढ़ते बच्चों के लिए भरोसेमंद, फ़ोन-आधारित सहायता",
    aboutTeachingTitle: "पढ़ाने का तरीका",
    aboutOfferingTitle: "कक्षा सारांश",
    contactEyebrow: "अभी कॉल करें",
    footerNote: "बढ़ते विद्यार्थियों और व्यस्त परिवारों के लिए दो-भाषी tuition सहायता।",
  },
};

export function isValidLocale(locale: string): locale is Locale {
  return isLocale(locale);
}

export function getLocaleSwitcherPath(locale: Locale, pathname: string) {
  const alternate = getAlternateLocale(locale);
  const suffix = pathname === `/${locale}` ? "" : pathname.replace(`/${locale}`, "");
  return `/${alternate}${suffix || ""}`;
}

export function getStaticMarketingContent(locale: Locale) {
  return staticMarketingContent[locale];
}

export function getLocalizedSiteContent(locale: Locale, content: SiteContent) {
  return {
    heroTitle: getLocalizedValue(locale, content.heroTitleEn, content.heroTitleHi),
    heroSubtitle: getLocalizedValue(locale, content.heroSubtitleEn, content.heroSubtitleHi),
    heroPrimaryCtaLabel: getLocalizedValue(
      locale,
      content.heroPrimaryCtaLabelEn,
      content.heroPrimaryCtaLabelHi,
    ),
    heroSecondaryCtaLabel: getLocalizedValue(
      locale,
      content.heroSecondaryCtaLabelEn,
      content.heroSecondaryCtaLabelHi,
    ),
    aboutIntro: getLocalizedValue(locale, content.aboutIntroEn, content.aboutIntroHi),
    teachingStyle: getLocalizedValue(locale, content.teachingStyleEn, content.teachingStyleHi),
    contactHeading: getLocalizedValue(locale, content.contactHeadingEn, content.contactHeadingHi),
    contactText: getLocalizedValue(locale, content.contactTextEn, content.contactTextHi),
    galleryTeaserTitle: getLocalizedValue(
      locale,
      content.galleryTeaserTitleEn,
      content.galleryTeaserTitleHi,
    ),
    galleryTeaserText: getLocalizedValue(
      locale,
      content.galleryTeaserTextEn,
      content.galleryTeaserTextHi,
    ),
  };
}

export function getLocalizedOffering(locale: Locale, offering: Offering) {
  return {
    id: offering.id,
    title: getLocalizedValue(locale, offering.titleEn, offering.titleHi),
    details: getLocalizedValue(locale, offering.detailsEn, offering.detailsHi),
    schedule: getLocalizedValue(locale, offering.scheduleEn, offering.scheduleHi),
  };
}

export function getLocalizedWhyChoose(locale: Locale, item: WhyChooseItem) {
  return {
    id: item.id,
    title: getLocalizedValue(locale, item.titleEn, item.titleHi),
    description: getLocalizedValue(locale, item.descriptionEn, item.descriptionHi),
  };
}

export function buildContactDetails(locale: Locale, settings: SiteSettings) {
  return [
    {
      label: locale === "hi" ? "फ़ोन" : "Phone",
      value: settings.phone,
      href: `tel:+91${settings.phone}`,
    },
    {
      label: "WhatsApp",
      value: settings.whatsapp || settings.phone,
      href: buildDefaultWhatsAppUrl(settings.whatsapp || settings.phone, locale),
    },
    {
      label: locale === "hi" ? "समय" : "Hours",
      value: settings.hours || "Mon-Fri",
      href: "#contact",
    },
  ];
}

export function mapMarketingViewData(data: PublicHomeData) {
  const localeContent = getStaticMarketingContent(data.locale);
  const editable = getLocalizedSiteContent(data.locale, data.content);

  return {
    ...localeContent,
    editable,
    offerings: data.offerings.map((item) => getLocalizedOffering(data.locale, item)),
    whyChoose: data.whyChoose.map((item) => getLocalizedWhyChoose(data.locale, item)),
    reviews: data.reviews,
    contactDetails: buildContactDetails(data.locale, data.settings),
    settings: data.settings,
  };
}
