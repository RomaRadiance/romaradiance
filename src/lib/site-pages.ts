import { defaultLocale, getLocalizedValue } from "@/lib/i18n";
import { hasSupabasePublicEnv, hasSupabaseServerEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePagesServerClient, createSupabasePagesServerClientFromContext } from "@/lib/supabase/pages-server";
import {
  seedGalleryItems,
  seedOfferings,
  seedParentInvites,
  seedProfiles,
  seedReviews,
  seedSiteContent,
  seedSiteSettings,
  seedWhyChooseItems,
  toPublicSeedReviews,
} from "@/lib/site-seed";
import type {
  GalleryItem,
  GalleryViewItem,
  Locale,
  Offering,
  ParentInvite,
  Profile,
  PublicHomeData,
  Review,
  SiteContent,
  SiteSettings,
  WhyChooseItem,
} from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";
import type { GetServerSidePropsContext, NextApiRequest } from "next";
import type { ServerResponse } from "node:http";

function mapSettingsRow(row: Record<string, unknown> | null): SiteSettings {
  if (!row) {
    return seedSiteSettings;
  }

  return {
    galleryEnabled: Boolean(row.gallery_enabled),
    phone: String(row.phone ?? seedSiteSettings.phone),
    whatsapp: String(row.whatsapp ?? "") || null,
    address: String(row.address ?? "") || null,
    hours: String(row.hours ?? "") || null,
  };
}

function mapContentRow(row: Record<string, unknown> | null): SiteContent {
  if (!row) {
    return seedSiteContent;
  }

  return {
    heroTitleEn: String(row.hero_title_en ?? seedSiteContent.heroTitleEn),
    heroTitleHi: String(row.hero_title_hi ?? seedSiteContent.heroTitleHi),
    heroSubtitleEn: String(row.hero_subtitle_en ?? seedSiteContent.heroSubtitleEn),
    heroSubtitleHi: String(row.hero_subtitle_hi ?? seedSiteContent.heroSubtitleHi),
    heroPrimaryCtaLabelEn: String(
      row.hero_primary_cta_label_en ?? seedSiteContent.heroPrimaryCtaLabelEn,
    ),
    heroPrimaryCtaLabelHi: String(
      row.hero_primary_cta_label_hi ?? seedSiteContent.heroPrimaryCtaLabelHi,
    ),
    heroSecondaryCtaLabelEn: String(
      row.hero_secondary_cta_label_en ?? seedSiteContent.heroSecondaryCtaLabelEn,
    ),
    heroSecondaryCtaLabelHi: String(
      row.hero_secondary_cta_label_hi ?? seedSiteContent.heroSecondaryCtaLabelHi,
    ),
    aboutIntroEn: String(row.about_intro_en ?? seedSiteContent.aboutIntroEn),
    aboutIntroHi: String(row.about_intro_hi ?? seedSiteContent.aboutIntroHi),
    teachingStyleEn: String(row.teaching_style_en ?? seedSiteContent.teachingStyleEn),
    teachingStyleHi: String(row.teaching_style_hi ?? seedSiteContent.teachingStyleHi),
    contactHeadingEn: String(row.contact_heading_en ?? seedSiteContent.contactHeadingEn),
    contactHeadingHi: String(row.contact_heading_hi ?? seedSiteContent.contactHeadingHi),
    contactTextEn: String(row.contact_text_en ?? seedSiteContent.contactTextEn),
    contactTextHi: String(row.contact_text_hi ?? seedSiteContent.contactTextHi),
    galleryTeaserTitleEn: String(
      row.gallery_teaser_title_en ?? seedSiteContent.galleryTeaserTitleEn,
    ),
    galleryTeaserTitleHi: String(
      row.gallery_teaser_title_hi ?? seedSiteContent.galleryTeaserTitleHi,
    ),
    galleryTeaserTextEn: String(
      row.gallery_teaser_text_en ?? seedSiteContent.galleryTeaserTextEn,
    ),
    galleryTeaserTextHi: String(
      row.gallery_teaser_text_hi ?? seedSiteContent.galleryTeaserTextHi,
    ),
  };
}

function mapOffering(row: Record<string, unknown>): Offering {
  return {
    id: String(row.id),
    titleEn: String(row.title_en),
    titleHi: String(row.title_hi),
    detailsEn: String(row.details_en),
    detailsHi: String(row.details_hi),
    scheduleEn: String(row.schedule_en),
    scheduleHi: String(row.schedule_hi),
    sortOrder: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function mapWhyChoose(row: Record<string, unknown>): WhyChooseItem {
  return {
    id: String(row.id),
    titleEn: String(row.title_en),
    titleHi: String(row.title_hi),
    descriptionEn: String(row.description_en),
    descriptionHi: String(row.description_hi),
    sortOrder: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function mapReview(row: Record<string, unknown>): Review {
  return {
    id: String(row.id),
    parentName: String(row.parent_name),
    publicDisplayName: String(row.public_display_name),
    reviewText: String(row.review_text),
    locale: (row.locale as Locale) ?? defaultLocale,
    status: (row.status as Review["status"]) ?? "pending",
    submittedAt: String(row.submitted_at),
    approvedAt: row.approved_at ? String(row.approved_at) : null,
    approvedBy: row.approved_by ? String(row.approved_by) : null,
  };
}

function mapGallery(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id),
    storagePath: String(row.storage_path),
    captionEn: row.caption_en ? String(row.caption_en) : null,
    captionHi: row.caption_hi ? String(row.caption_hi) : null,
    altTextEn: row.alt_text_en ? String(row.alt_text_en) : null,
    altTextHi: row.alt_text_hi ? String(row.alt_text_hi) : null,
    displayDate: row.display_date ? String(row.display_date) : null,
    sortOrder: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
    uploadedAt: String(row.uploaded_at),
    uploadedBy: row.uploaded_by ? String(row.uploaded_by) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapProfile(row: Record<string, unknown>): Profile {
  return {
    userId: String(row.user_id),
    email: String(row.email),
    role: row.role as Profile["role"],
    displayName: String(row.display_name),
    active: Boolean(row.active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapInvite(row: Record<string, unknown>): ParentInvite {
  return {
    id: String(row.id),
    email: String(row.email),
    displayName: String(row.display_name),
    active: Boolean(row.active),
    lastInvitedAt: String(row.last_invited_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function createRequestClient(req: NextApiRequest, res: ServerResponse) {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  return createSupabasePagesServerClient(req, res);
}

function createContextClient(context: GetServerSidePropsContext) {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  return createSupabasePagesServerClientFromContext(context);
}

export async function getSiteSettingsForRequest(req: NextApiRequest, res: ServerResponse) {
  const client = createRequestClient(req, res);

  if (!client) {
    return seedSiteSettings;
  }

  const { data } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return mapSettingsRow((data as Record<string, unknown> | null) ?? null);
}

export async function getSiteSettingsForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedSiteSettings;
  }

  const { data } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return mapSettingsRow((data as Record<string, unknown> | null) ?? null);
}

export async function getSiteContentForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedSiteContent;
  }

  const { data } = await client.from("site_content").select("*").eq("id", 1).maybeSingle();
  return mapContentRow((data as Record<string, unknown> | null) ?? null);
}

export async function getOfferingsForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedOfferings;
  }

  const { data } = await client
    .from("offerings")
    .select("*")
    .order("sort_order", { ascending: true });

  return ((data as Record<string, unknown>[] | null) ?? []).map(mapOffering);
}

export async function getWhyChooseItemsForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedWhyChooseItems;
  }

  const { data } = await client
    .from("why_choose_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return ((data as Record<string, unknown>[] | null) ?? []).map(mapWhyChoose);
}

export async function getApprovedReviewsForPage(context: GetServerSidePropsContext, locale: Locale) {
  const client = createContextClient(context);

  if (!client) {
    return toPublicSeedReviews(locale);
  }

  const { data } = await client
    .from("reviews")
    .select("id, public_display_name, review_text")
    .eq("status", "approved")
    .eq("locale", locale)
    .order("submitted_at", { ascending: false });

  return ((data as Record<string, unknown>[] | null) ?? []).map((review) => ({
    id: String(review.id),
    displayName: String(review.public_display_name),
    reviewText: String(review.review_text),
  }));
}

export async function getAllReviewsForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedReviews;
  }

  const { data } = await client
    .from("reviews")
    .select("*")
    .order("submitted_at", { ascending: false });

  return ((data as Record<string, unknown>[] | null) ?? []).map(mapReview);
}

export async function getGalleryItemsForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedGalleryItems;
  }

  const { data } = await client
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  return ((data as Record<string, unknown>[] | null) ?? []).map(mapGallery);
}

export async function getProfilesForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedProfiles;
  }

  const { data } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  return ((data as Record<string, unknown>[] | null) ?? []).map(mapProfile);
}

export async function getParentInvitesForPage(context: GetServerSidePropsContext) {
  const client = createContextClient(context);

  if (!client) {
    return seedParentInvites;
  }

  const { data } = await client
    .from("parent_invites")
    .select("*")
    .order("created_at", { ascending: false });

  return ((data as Record<string, unknown>[] | null) ?? []).map(mapInvite);
}

export async function getCurrentProfileForRequest(
  req: NextApiRequest,
  res: ServerResponse,
  userId: string,
) {
  const client = createRequestClient(req, res);

  if (!client) {
    return null;
  }

  const { data } = await client.from("profiles").select("*").eq("user_id", userId).maybeSingle();

  if (!data) {
    return null;
  }

  return mapProfile(data as Record<string, unknown>);
}

export async function getPublicHomeDataForPage(
  context: GetServerSidePropsContext,
  locale: Locale,
): Promise<PublicHomeData> {
  const [settings, content, offerings, whyChoose, reviews] = await Promise.all([
    getSiteSettingsForPage(context),
    getSiteContentForPage(context),
    getOfferingsForPage(context),
    getWhyChooseItemsForPage(context),
    getApprovedReviewsForPage(context, locale),
  ]);

  return {
    locale,
    settings,
    content,
    offerings: offerings.filter((item) => item.active),
    whyChoose: whyChoose.filter((item) => item.active),
    reviews,
  };
}

export async function getSignedGalleryItemsForPage(
  context: GetServerSidePropsContext,
  locale: Locale,
): Promise<GalleryViewItem[]> {
  const items = await getGalleryItemsForPage(context);

  if (!hasSupabaseServerEnv() || items.length === 0) {
    return items.filter((item) => item.active).map((item) => ({
      id: item.id,
      title: formatDisplayDate(item.displayDate) ?? item.id,
      caption: getLocalizedValue(locale, item.captionEn ?? "", item.captionHi ?? "") || null,
      altText: getLocalizedValue(
        locale,
        item.altTextEn ?? item.captionEn ?? "Roma Tuition gallery image",
        item.altTextHi ?? item.captionHi ?? "Roma Tuition gallery image",
      ),
      signedUrl: null,
      active: item.active,
      displayDate: formatDisplayDate(item.displayDate),
    }));
  }

  const adminClient = createSupabaseAdminClient();
  const activeItems = items.filter((item) => item.active);
  const paths = activeItems.map((item) => item.storagePath);
  const { data } = await adminClient.storage.from("gallery").createSignedUrls(paths, 60 * 10);

  return activeItems.map((item, index) => ({
    id: item.id,
    title: formatDisplayDate(item.displayDate) ?? `Gallery item ${index + 1}`,
    caption: getLocalizedValue(locale, item.captionEn ?? "", item.captionHi ?? "") || null,
    altText: getLocalizedValue(
      locale,
      item.altTextEn ?? item.captionEn ?? "Roma Tuition gallery image",
      item.altTextHi ?? item.captionHi ?? "Roma Tuition gallery image",
    ),
    signedUrl: data?.[index]?.signedUrl ?? null,
    active: item.active,
    displayDate: formatDisplayDate(item.displayDate),
  }));
}
