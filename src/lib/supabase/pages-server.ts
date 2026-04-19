import { createServerClient } from "@supabase/ssr";
import { serialize } from "cookie";
import type { GetServerSidePropsContext, NextApiRequest } from "next";
import type { ServerResponse } from "node:http";

import type { CookieOptions, SetAllCookies } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env";

type RequestLike = Pick<NextApiRequest, "cookies">;
type ResponseLike = Pick<ServerResponse, "getHeader" | "setHeader">;

function appendSetCookieHeader(res: ResponseLike, value: string) {
  const current = res.getHeader("Set-Cookie");

  if (!current) {
    res.setHeader("Set-Cookie", value);
    return;
  }

  if (Array.isArray(current)) {
    res.setHeader("Set-Cookie", [...current, value]);
    return;
  }

  res.setHeader("Set-Cookie", [String(current), value]);
}

function setResponseHeaders(res: ResponseLike, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export function createSupabasePagesServerClient(req: RequestLike, res: ResponseLike) {
  const env = getPublicEnv();

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () =>
        Object.entries(req.cookies ?? {}).flatMap(([name, value]) =>
          typeof value === "string"
            ? [
                {
                  name,
                  value,
                },
              ]
            : [],
        ),
      setAll: ((cookiesToSet, headers) => {
        cookiesToSet.forEach(
          ({ name, value, options }: { name: string; value: string; options: CookieOptions }) => {
          appendSetCookieHeader(res, serialize(name, value, options));
          },
        );
        setResponseHeaders(res, headers);
      }) satisfies SetAllCookies,
    },
  });
}

export function createSupabasePagesServerClientFromContext(context: GetServerSidePropsContext) {
  return createSupabasePagesServerClient(context.req, context.res);
}
