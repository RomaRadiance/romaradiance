import type { Locale } from "@/lib/types";

function buildWhatsAppMessage(locale: Locale) {
  return locale === "hi"
    ? "नमस्ते, मुझे Roma Tuition के बारे में जानकारी चाहिए।"
    : "Hello, I would like to know more about Roma Tuition.";
}

export function buildWhatsAppUrl(phone: string, locale: Locale, isDesktop: boolean) {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(buildWhatsAppMessage(locale));

  if (isDesktop) {
    return `https://web.whatsapp.com/send?phone=91${cleanPhone}&text=${encodedMessage}`;
  }

  return `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodedMessage}`;
}

export function buildDefaultWhatsAppUrl(phone: string, locale: Locale) {
  return buildWhatsAppUrl(phone, locale, false);
}
