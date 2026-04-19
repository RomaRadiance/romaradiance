import type {
  GalleryItem,
  Offering,
  ParentInvite,
  Profile,
  PublicReviewItem,
  Review,
  SiteContent,
  SiteSettings,
  WhyChooseItem,
} from "@/lib/types";

const now = new Date().toISOString();

export const seedSiteSettings: SiteSettings = {
  galleryEnabled: false,
  phone: "9717195965",
  whatsapp: "9717195965",
  address: "Phone-first local tuition support",
  hours: "Mon-Fri",
};

export const seedSiteContent: SiteContent = {
  heroTitleEn: "Fun learning with caring guidance",
  heroTitleHi: "मज़ेदार पढ़ाई और भरोसेमंद मार्गदर्शन",
  heroSubtitleEn:
    "Roma Tuition helps young learners build confidence through clear explanations, regular practice, and a cheerful classroom rhythm.",
  heroSubtitleHi:
    "Roma Tuition में बच्चों को आसान समझाइश, नियमित अभ्यास और खुशहाल पढ़ाई के माहौल से आत्मविश्वास मिलता है।",
  heroPrimaryCtaLabelEn: "Call now",
  heroPrimaryCtaLabelHi: "अभी कॉल करें",
  heroSecondaryCtaLabelEn: "Learn more",
  heroSecondaryCtaLabelHi: "और जानें",
  aboutIntroEn:
    "Teacher Roma offers phone-first, trust-building tuition support for primary and middle-school learners, with a focus on clear concepts and encouraging routines.",
  aboutIntroHi:
    "Teacher Roma छोटे और मिडिल स्कूल के बच्चों के लिए भरोसेमंद tuition support देती हैं, जहाँ साफ समझ और नियमित अभ्यास पर ध्यान रहता है।",
  teachingStyleEn:
    "Classes combine revision, guided homework help, handwriting support, and child-friendly explanation styles that keep children engaged without pressure.",
  teachingStyleHi:
    "क्लासों में revision, guided homework help, handwriting support और बच्चों को सहज लगे ऐसी teaching style शामिल रहती है।",
  contactHeadingEn: "Talk directly with Teacher Roma",
  contactHeadingHi: "Teacher Roma से सीधे बात करें",
  contactTextEn:
    "Call for batch timings, class details, and a quick conversation about what support your child needs right now.",
  contactTextHi:
    "बैच टाइमिंग, क्लास की जानकारी और आपके बच्चे को अभी किस मदद की ज़रूरत है, इस बारे में बात करने के लिए कॉल करें।",
  galleryTeaserTitleEn: "Private parent gallery",
  galleryTeaserTitleHi: "माता-पिता के लिए निजी gallery",
  galleryTeaserTextEn:
    "The gallery is available only to invited parents and may be turned on or off by the admin at different times.",
  galleryTeaserTextHi:
    "Gallery केवल invited parents के लिए है और admin इसे अलग-अलग समय पर चालू या बंद कर सकता है।",
};

export const seedOfferings: Offering[] = [
  {
    id: "offering-grades-1-5",
    titleEn: "Grades 1 to 5 • All subjects",
    titleHi: "कक्षा 1 से 5 • सभी विषय",
    detailsEn: "Warm daily support across core school subjects for young learners.",
    detailsHi: "छोटे बच्चों के लिए मुख्य स्कूल विषयों में नियमित सहयोग।",
    scheduleEn: "5 days/week",
    scheduleHi: "सप्ताह में 5 दिन",
    sortOrder: 1,
    active: true,
  },
  {
    id: "offering-maths-science",
    titleEn: "Math and Science • Grades 6 to 8",
    titleHi: "Math और Science • कक्षा 6 से 8",
    detailsEn: "Concept clarity, practice, and homework support for middle-school maths and science.",
    detailsHi: "मिडिल स्कूल maths और science के लिए concept clarity और practice।",
    scheduleEn: "5 days/week or alternate days",
    scheduleHi: "सप्ताह में 5 दिन या alternate days",
    sortOrder: 2,
    active: true,
  },
  {
    id: "offering-languages",
    titleEn: "Sanskrit and Hindi",
    titleHi: "Sanskrit और Hindi",
    detailsEn: "Focused language support with reading, writing, and schoolwork help.",
    detailsHi: "भाषा सहायता, reading-writing और schoolwork help के साथ।",
    scheduleEn: "Alternate days",
    scheduleHi: "एक दिन छोड़कर",
    sortOrder: 3,
    active: true,
  },
  {
    id: "offering-handwriting",
    titleEn: "Handwriting improvement",
    titleHi: "Handwriting improvement",
    detailsEn: "Neat writing practice with guided strokes, spacing, and presentation.",
    detailsHi: "साफ लिखावट के लिए guided practice और presentation support।",
    scheduleEn: "Weekends only",
    scheduleHi: "सिर्फ weekends",
    sortOrder: 4,
    active: true,
  },
];

export const seedWhyChooseItems: WhyChooseItem[] = [
  {
    id: "why-personal-attention",
    titleEn: "Small-group personal attention",
    titleHi: "छोटे बैच और व्यक्तिगत ध्यान",
    descriptionEn:
      "Children get space to ask questions freely and build confidence with patient correction.",
    descriptionHi:
      "बच्चों को खुलकर सवाल पूछने और धैर्य से समझने का मौका मिलता है।",
    sortOrder: 1,
    active: true,
  },
  {
    id: "why-consistency",
    titleEn: "Consistent routines",
    titleHi: "नियमित पढ़ाई का रूटीन",
    descriptionEn:
      "Steady revision, homework help, and practice keep school learning from piling up.",
    descriptionHi:
      "रोज़ का revision और practice बच्चों को पढ़ाई में steady रखता है।",
    sortOrder: 2,
    active: true,
  },
  {
    id: "why-friendly-environment",
    titleEn: "Child-friendly environment",
    titleHi: "बच्चों के लिए दोस्ताना माहौल",
    descriptionEn:
      "The tone stays cheerful, encouraging, and practical for primary and middle-school learners.",
    descriptionHi:
      "माहौल cheerful, encouraging और बच्चों के अनुकूल रखा जाता है।",
    sortOrder: 3,
    active: true,
  },
];

export const seedReviews: Review[] = [
  {
    id: "review-1",
    parentName: "Pooja Sharma",
    publicDisplayName: "Pooja",
    reviewText:
      "Roma Ma'am explains with patience and my child feels much more confident with homework now.",
    locale: "en",
    status: "approved",
    submittedAt: now,
    approvedAt: now,
    approvedBy: null,
  },
  {
    id: "review-2",
    parentName: "Neha Verma",
    publicDisplayName: "नेहा",
    reviewText: "बच्चे को अब पढ़ाई से डर नहीं लगता और homework आसानी से पूरा हो जाता है।",
    locale: "hi",
    status: "approved",
    submittedAt: now,
    approvedAt: now,
    approvedBy: null,
  },
];

export const seedGalleryItems: GalleryItem[] = [];
export const seedProfiles: Profile[] = [];
export const seedParentInvites: ParentInvite[] = [];

export function toPublicSeedReviews(locale: "en" | "hi"): PublicReviewItem[] {
  return seedReviews
    .filter((review) => review.status === "approved" && review.locale === locale)
    .map((review) => ({
      id: review.id,
      displayName: review.publicDisplayName,
      reviewText: review.reviewText,
    }));
}
