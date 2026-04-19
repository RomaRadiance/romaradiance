export type Locale = "en" | "hi";
export type Role = "admin" | "parent";
export type ReviewStatus = "pending" | "approved" | "rejected";

export type SiteSettings = {
  galleryEnabled: boolean;
  phone: string;
  whatsapp?: string | null;
  address?: string | null;
  hours?: string | null;
};

export type SiteContent = {
  heroTitleEn: string;
  heroTitleHi: string;
  heroSubtitleEn: string;
  heroSubtitleHi: string;
  heroPrimaryCtaLabelEn: string;
  heroPrimaryCtaLabelHi: string;
  heroSecondaryCtaLabelEn: string;
  heroSecondaryCtaLabelHi: string;
  aboutIntroEn: string;
  aboutIntroHi: string;
  teachingStyleEn: string;
  teachingStyleHi: string;
  contactHeadingEn: string;
  contactHeadingHi: string;
  contactTextEn: string;
  contactTextHi: string;
  galleryTeaserTitleEn: string;
  galleryTeaserTitleHi: string;
  galleryTeaserTextEn: string;
  galleryTeaserTextHi: string;
};

export type WhyChooseItem = {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  descriptionHi: string;
  sortOrder: number;
  active: boolean;
};

export type Offering = {
  id: string;
  titleEn: string;
  titleHi: string;
  detailsEn: string;
  detailsHi: string;
  scheduleEn: string;
  scheduleHi: string;
  sortOrder: number;
  active: boolean;
};

export type Review = {
  id: string;
  parentName: string;
  publicDisplayName: string;
  reviewText: string;
  locale: Locale;
  status: ReviewStatus;
  submittedAt: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
};

export type GalleryItem = {
  id: string;
  storagePath: string;
  captionEn?: string | null;
  captionHi?: string | null;
  altTextEn?: string | null;
  altTextHi?: string | null;
  displayDate?: string | null;
  sortOrder: number;
  active: boolean;
  uploadedAt: string;
  uploadedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  userId: string;
  email: string;
  role: Role;
  displayName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ParentInvite = {
  id: string;
  email: string;
  displayName: string;
  active: boolean;
  lastInvitedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type GalleryViewItem = {
  id: string;
  title: string;
  caption: string | null;
  altText: string;
  signedUrl: string | null;
  active: boolean;
  displayDate: string | null;
};

export type PublicReviewItem = {
  id: string;
  displayName: string;
  reviewText: string;
};

export type PublicHomeData = {
  locale: Locale;
  settings: SiteSettings;
  content: SiteContent;
  offerings: Offering[];
  whyChoose: WhyChooseItem[];
  reviews: PublicReviewItem[];
};
