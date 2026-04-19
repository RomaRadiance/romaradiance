import { z } from "zod";

export const adminContentSchema = z.object({
  heroTitleEn: z.string().trim().min(3),
  heroTitleHi: z.string().trim().min(3),
  heroSubtitleEn: z.string().trim().min(10),
  heroSubtitleHi: z.string().trim().min(10),
  heroPrimaryCtaLabelEn: z.string().trim().min(2),
  heroPrimaryCtaLabelHi: z.string().trim().min(2),
  heroSecondaryCtaLabelEn: z.string().trim().min(2),
  heroSecondaryCtaLabelHi: z.string().trim().min(2),
  aboutIntroEn: z.string().trim().min(10),
  aboutIntroHi: z.string().trim().min(10),
  teachingStyleEn: z.string().trim().min(10),
  teachingStyleHi: z.string().trim().min(10),
  contactHeadingEn: z.string().trim().min(3),
  contactHeadingHi: z.string().trim().min(3),
  contactTextEn: z.string().trim().min(10),
  contactTextHi: z.string().trim().min(10),
  galleryTeaserTitleEn: z.string().trim().min(3),
  galleryTeaserTitleHi: z.string().trim().min(3),
  galleryTeaserTextEn: z.string().trim().min(10),
  galleryTeaserTextHi: z.string().trim().min(10),
});

export const adminSettingsSchema = z.object({
  phone: z.string().trim().min(10),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  address: z.string().trim().optional().or(z.literal("")),
  hours: z.string().trim().optional().or(z.literal("")),
  galleryEnabled: z.boolean(),
});

export const offeringSchema = z.object({
  titleEn: z.string().trim().min(3),
  titleHi: z.string().trim().min(3),
  detailsEn: z.string().trim().min(5),
  detailsHi: z.string().trim().min(5),
  scheduleEn: z.string().trim().min(3),
  scheduleHi: z.string().trim().min(3),
  sortOrder: z.coerce.number().int().nonnegative(),
  active: z.boolean(),
});

export const whyChooseSchema = z.object({
  titleEn: z.string().trim().min(3),
  titleHi: z.string().trim().min(3),
  descriptionEn: z.string().trim().min(5),
  descriptionHi: z.string().trim().min(5),
  sortOrder: z.coerce.number().int().nonnegative(),
  active: z.boolean(),
});

export const inviteParentSchema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(2).max(80),
});

export const galleryMetadataSchema = z.object({
  captionEn: z.string().trim().max(160).optional().or(z.literal("")),
  captionHi: z.string().trim().max(160).optional().or(z.literal("")),
  altTextEn: z.string().trim().max(160).optional().or(z.literal("")),
  altTextHi: z.string().trim().max(160).optional().or(z.literal("")),
  displayDate: z.string().trim().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().nonnegative(),
  active: z.boolean(),
});
