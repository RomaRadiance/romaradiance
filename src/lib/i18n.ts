import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["en", "hi"];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE_NAME = "roma-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }

  return defaultLocale;
}

export function detectLocaleFromHeader(headerValue: string | null): Locale {
  if (!headerValue) {
    return defaultLocale;
  }

  const normalized = headerValue.toLowerCase();

  if (normalized.includes("hi")) {
    return "hi";
  }

  return defaultLocale;
}

export function pickPreferredLocale(
  cookieLocale: string | undefined,
  acceptLanguage: string | null,
) {
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return detectLocaleFromHeader(acceptLanguage);
}

export function buildLocalizedPath(locale: Locale, pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${normalizedPath}`;
}

export function stripLocaleFromPath(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/");

  if (!maybeLocale || !isLocale(maybeLocale)) {
    return pathname;
  }

  const result = `/${rest.join("/")}`.replace(/\/$/, "") || "/";
  return result === "" ? "/" : result;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "hi" : "en";
}

export function getLocalizedValue(locale: Locale, english: string, hindi: string) {
  if (locale === "hi" && hindi.trim().length > 0) {
    return hindi;
  }

  return english;
}
