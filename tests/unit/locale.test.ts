import { describe, expect, it } from "vitest";

import {
  LOCALE_COOKIE_NAME,
  buildLocalizedPath,
  detectLocaleFromHeader,
  getAlternateLocale,
  isLocale,
  normalizeLocale,
  pickPreferredLocale,
} from "@/lib/i18n";

describe("locale helpers", () => {
  it("recognizes supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("hi")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("normalizes unknown locales to default", () => {
    expect(normalizeLocale("hi")).toBe("hi");
    expect(normalizeLocale("unknown")).toBe("en");
  });

  it("builds localized paths without duplicate slashes", () => {
    expect(buildLocalizedPath("en", "/about")).toBe("/en/about");
    expect(buildLocalizedPath("hi", "about")).toBe("/hi/about");
    expect(buildLocalizedPath("hi", "/")).toBe("/hi");
  });

  it("detects locale from accept-language", () => {
    expect(detectLocaleFromHeader("hi-IN,hi;q=0.9,en;q=0.8")).toBe("hi");
    expect(detectLocaleFromHeader("en-US,en;q=0.9")).toBe("en");
    expect(detectLocaleFromHeader(null)).toBe("en");
  });

  it("prefers cookie locale over header", () => {
    expect(pickPreferredLocale("hi", "en-US,en;q=0.9")).toBe("hi");
    expect(pickPreferredLocale(undefined, "hi-IN,hi;q=0.9")).toBe("hi");
  });

  it("returns alternate locale", () => {
    expect(getAlternateLocale("en")).toBe("hi");
    expect(getAlternateLocale("hi")).toBe("en");
  });

  it("keeps cookie constant stable", () => {
    expect(LOCALE_COOKIE_NAME).toBe("roma-locale");
  });
});
