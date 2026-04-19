import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  LOCALE_COOKIE_NAME,
  buildLocalizedPath,
  defaultLocale,
  isLocale,
  pickPreferredLocale,
} from "@/lib/i18n";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_FILE = /\.(.*)$/;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const locale = pickPreferredLocale(
      request.cookies.get(LOCALE_COOKIE_NAME)?.value,
      request.headers.get("accept-language"),
    );
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const response = NextResponse.next();
  const pathSegments = pathname.split("/").filter(Boolean);
  const firstSegment = pathSegments[0];

  if (firstSegment && /^[a-z]{2}$/i.test(firstSegment) && !isLocale(firstSegment)) {
    const rest = pathSegments.slice(1).join("/");
    const nextPath = rest ? `/${defaultLocale}/${rest}` : `/${defaultLocale}`;
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  if (firstSegment && !["admin", "parent", "auth"].includes(firstSegment) && !isLocale(firstSegment)) {
    const locale = pickPreferredLocale(
      request.cookies.get(LOCALE_COOKIE_NAME)?.value,
      request.headers.get("accept-language"),
    );
    return NextResponse.redirect(new URL(buildLocalizedPath(locale, pathname), request.url));
  }

  if (!hasSupabasePublicEnv()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && pathname.startsWith("/admin") && pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (!user && pathname.startsWith("/parent") && pathname !== "/parent/login") {
    return NextResponse.redirect(new URL("/parent/login", request.url));
  }

  if (pathname.startsWith("/") && isLocale(firstSegment ?? "")) {
    response.cookies.set(LOCALE_COOKIE_NAME, firstSegment!, {
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
