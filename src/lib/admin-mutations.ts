import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

import { getRequestAuthContext } from "@/lib/auth-pages";
import { getOptionalSiteUrl, hasSupabasePublicEnv, hasSupabaseServerEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  adminContentSchema,
  adminSettingsSchema,
  galleryMetadataSchema,
  inviteParentSchema,
  offeringSchema,
  whyChooseSchema,
} from "@/lib/validation/admin";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export class AdminMutationError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function requireServerEnv() {
  if (!hasSupabaseServerEnv()) {
    throw new AdminMutationError("Configure Supabase server environment variables first.", 503);
  }
}

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export async function requireAdminRequest(req: NextApiRequest, res: NextApiResponse) {
  const auth = await getRequestAuthContext(req, res);

  if (!auth.userId || !auth.profile || auth.profile.role !== "admin" || !auth.profile.active) {
    throw new AdminMutationError("Unauthorized", 401);
  }

  return auth;
}

export async function updateSiteContent(input: Record<string, unknown>) {
  requireServerEnv();
  const parsed = adminContentSchema.safeParse(input);

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid content payload.");
  }

  const supabase = createSupabaseAdminClient();
  const data = parsed.data;
  const { error } = await supabase.from("site_content").upsert({
    id: 1,
    hero_title_en: data.heroTitleEn,
    hero_title_hi: data.heroTitleHi,
    hero_subtitle_en: data.heroSubtitleEn,
    hero_subtitle_hi: data.heroSubtitleHi,
    hero_primary_cta_label_en: data.heroPrimaryCtaLabelEn,
    hero_primary_cta_label_hi: data.heroPrimaryCtaLabelHi,
    hero_secondary_cta_label_en: data.heroSecondaryCtaLabelEn,
    hero_secondary_cta_label_hi: data.heroSecondaryCtaLabelHi,
    about_intro_en: data.aboutIntroEn,
    about_intro_hi: data.aboutIntroHi,
    teaching_style_en: data.teachingStyleEn,
    teaching_style_hi: data.teachingStyleHi,
    contact_heading_en: data.contactHeadingEn,
    contact_heading_hi: data.contactHeadingHi,
    contact_text_en: data.contactTextEn,
    contact_text_hi: data.contactTextHi,
    gallery_teaser_title_en: data.galleryTeaserTitleEn,
    gallery_teaser_title_hi: data.galleryTeaserTitleHi,
    gallery_teaser_text_en: data.galleryTeaserTextEn,
    gallery_teaser_text_hi: data.galleryTeaserTextHi,
  });

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function updateSiteSettings(input: Record<string, unknown>) {
  requireServerEnv();
  const parsed = adminSettingsSchema.safeParse({
    phone: input.phone,
    whatsapp: input.whatsapp,
    address: input.address,
    hours: input.hours,
    galleryEnabled: toBoolean(input.galleryEnabled),
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid settings.");
  }

  const supabase = createSupabaseAdminClient();
  const data = parsed.data;
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    phone: data.phone,
    whatsapp: data.whatsapp || null,
    address: data.address || null,
    hours: data.hours || null,
    gallery_enabled: data.galleryEnabled,
  });

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function saveOffering(input: Record<string, unknown>) {
  requireServerEnv();
  const parsed = offeringSchema.safeParse({
    titleEn: input.titleEn,
    titleHi: input.titleHi,
    detailsEn: input.detailsEn,
    detailsHi: input.detailsHi,
    scheduleEn: input.scheduleEn,
    scheduleHi: input.scheduleHi,
    sortOrder: input.sortOrder,
    active: toBoolean(input.active),
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid offering.");
  }

  const supabase = createSupabaseAdminClient();
  const data = parsed.data;
  const { error } = await supabase.from("offerings").upsert({
    id: String(input.id || crypto.randomUUID()),
    title_en: data.titleEn,
    title_hi: data.titleHi,
    details_en: data.detailsEn,
    details_hi: data.detailsHi,
    schedule_en: data.scheduleEn,
    schedule_hi: data.scheduleHi,
    sort_order: data.sortOrder,
    active: data.active,
  });

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function saveWhyChoose(input: Record<string, unknown>) {
  requireServerEnv();
  const parsed = whyChooseSchema.safeParse({
    titleEn: input.titleEn,
    titleHi: input.titleHi,
    descriptionEn: input.descriptionEn,
    descriptionHi: input.descriptionHi,
    sortOrder: input.sortOrder,
    active: toBoolean(input.active),
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid Why Choose item.");
  }

  const supabase = createSupabaseAdminClient();
  const data = parsed.data;
  const { error } = await supabase.from("why_choose_items").upsert({
    id: String(input.id || crypto.randomUUID()),
    title_en: data.titleEn,
    title_hi: data.titleHi,
    description_en: data.descriptionEn,
    description_hi: data.descriptionHi,
    sort_order: data.sortOrder,
    active: data.active,
  });

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function updateReviewStatus(input: Record<string, unknown>, approvedBy: string) {
  requireServerEnv();
  const reviewId = String(input.id || "");
  const status = String(input.status || "");

  if (!reviewId || !["approved", "rejected", "pending"].includes(status)) {
    throw new AdminMutationError("Invalid review action.");
  }

  const supabase = createSupabaseAdminClient();
  const isApproved = status === "approved";

  const { error } = await supabase
    .from("reviews")
    .update({
      status,
      approved_at: isApproved ? new Date().toISOString() : null,
      approved_by: isApproved ? approvedBy : null,
    })
    .eq("id", reviewId);

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

async function sendParentInviteOrMagicLink(email: string, displayName: string) {
  const redirectTo = `${getOptionalSiteUrl()}/auth/confirm?next=/parent/gallery`;
  const adminClient = createSupabaseAdminClient();
  const inviteResponse = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: {
      display_name: displayName,
      role: "parent",
    },
    redirectTo,
  });

  if (!inviteResponse.error) {
    return;
  }

  if (!hasSupabasePublicEnv()) {
    throw inviteResponse.error;
  }

  const publicClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const magicLinkResponse = await publicClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: false,
    },
  });

  if (magicLinkResponse.error) {
    throw inviteResponse.error;
  }
}

export async function inviteParent(input: Record<string, unknown>) {
  requireServerEnv();
  const parsed = inviteParentSchema.safeParse({
    email: input.email,
    displayName: input.displayName,
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid parent invite.");
  }

  const data = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("parent_invites").upsert({
    id: String(input.id || crypto.randomUUID()),
    email: data.email,
    display_name: data.displayName,
    active: true,
    last_invited_at: new Date().toISOString(),
  });

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }

  try {
    await sendParentInviteOrMagicLink(data.email, data.displayName);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send invite email.";
    throw new AdminMutationError(message, 500);
  }
}

export async function toggleInviteActive(input: Record<string, unknown>) {
  requireServerEnv();
  const id = String(input.id || "");
  const nextValue = toBoolean(input.active);

  if (!id) {
    throw new AdminMutationError("Invalid invite.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("parent_invites").update({ active: nextValue }).eq("id", id);

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function toggleParentProfileActive(input: Record<string, unknown>) {
  requireServerEnv();
  const userId = String(input.userId || "");
  const nextValue = toBoolean(input.active);

  if (!userId) {
    throw new AdminMutationError("Invalid parent profile.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("profiles").update({ active: nextValue }).eq("user_id", userId);

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function uploadGalleryItem(input: {
  file: File;
  values: Record<string, unknown>;
  uploadedBy: string;
}) {
  requireServerEnv();

  if (!ALLOWED_IMAGE_TYPES.has(input.file.type)) {
    throw new AdminMutationError("Only JPG, PNG, and WEBP images are allowed.");
  }

  if (input.file.size > MAX_UPLOAD_BYTES) {
    throw new AdminMutationError("Image exceeds 5MB upload limit.");
  }

  const parsed = galleryMetadataSchema.safeParse({
    captionEn: input.values.captionEn,
    captionHi: input.values.captionHi,
    altTextEn: input.values.altTextEn,
    altTextHi: input.values.altTextHi,
    displayDate: input.values.displayDate,
    sortOrder: input.values.sortOrder,
    active: toBoolean(input.values.active),
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid gallery metadata.");
  }

  const ext = input.file.name.split(".").pop()?.toLowerCase() || "jpg";
  const itemId = crypto.randomUUID();
  const storagePath = `gallery/${itemId}/original.${ext}`;
  const buffer = Buffer.from(await input.file.arrayBuffer());
  const supabase = createSupabaseAdminClient();
  const uploadResponse = await supabase.storage.from("gallery").upload(storagePath, buffer, {
    cacheControl: "3600",
    contentType: input.file.type,
    upsert: false,
  });

  if (uploadResponse.error) {
    throw new AdminMutationError(uploadResponse.error.message, 500);
  }

  const data = parsed.data;
  const { error } = await supabase.from("gallery_items").insert({
    id: itemId,
    storage_path: storagePath,
    caption_en: data.captionEn || null,
    caption_hi: data.captionHi || null,
    alt_text_en: data.altTextEn || null,
    alt_text_hi: data.altTextHi || null,
    display_date: data.displayDate || null,
    sort_order: data.sortOrder,
    active: data.active,
    uploaded_by: input.uploadedBy,
  });

  if (error) {
    await supabase.storage.from("gallery").remove([storagePath]);
    throw new AdminMutationError(error.message, 500);
  }
}

export async function saveGalleryItem(input: Record<string, unknown>) {
  requireServerEnv();
  const id = String(input.id || "");

  if (!id) {
    throw new AdminMutationError("Invalid gallery item.");
  }

  const parsed = galleryMetadataSchema.safeParse({
    captionEn: input.captionEn,
    captionHi: input.captionHi,
    altTextEn: input.altTextEn,
    altTextHi: input.altTextHi,
    displayDate: input.displayDate,
    sortOrder: input.sortOrder,
    active: toBoolean(input.active),
  });

  if (!parsed.success) {
    throw new AdminMutationError(parsed.error.issues[0]?.message || "Invalid gallery metadata.");
  }

  const data = parsed.data;
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("gallery_items")
    .update({
      caption_en: data.captionEn || null,
      caption_hi: data.captionHi || null,
      alt_text_en: data.altTextEn || null,
      alt_text_hi: data.altTextHi || null,
      display_date: data.displayDate || null,
      sort_order: data.sortOrder,
      active: data.active,
    })
    .eq("id", id);

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}

export async function deleteGalleryItem(input: Record<string, unknown>) {
  requireServerEnv();
  const id = String(input.id || "");

  if (!id) {
    throw new AdminMutationError("Invalid gallery item.");
  }

  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from("gallery_items").select("storage_path").eq("id", id).maybeSingle();

  if (data?.storage_path) {
    await supabase.storage.from("gallery").remove([String(data.storage_path)]);
  }

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);

  if (error) {
    throw new AdminMutationError(error.message, 500);
  }
}
