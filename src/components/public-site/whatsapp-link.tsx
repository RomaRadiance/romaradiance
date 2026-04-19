"use client";

import { useMemo } from "react";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppLinkProps = {
  phone: string;
  locale: "en" | "hi";
  className?: string;
  children: React.ReactNode;
};

export function WhatsAppLink({ phone, locale, className, children }: WhatsAppLinkProps) {
  const href = useMemo(() => {
    if (typeof navigator === "undefined") {
      return buildWhatsAppUrl(phone, locale, false);
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const isDesktop = !/android|iphone|ipad|ipod|mobile/i.test(userAgent);
    return buildWhatsAppUrl(phone, locale, isDesktop);
  }, [locale, phone]);

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}
