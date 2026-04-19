import type { GetServerSidePropsContext, GetServerSidePropsResult, NextApiRequest, NextApiResponse } from "next";

import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabasePagesServerClient, createSupabasePagesServerClientFromContext } from "@/lib/supabase/pages-server";
import type { Profile, Role } from "@/lib/types";

export type RequestAuthContext = {
  configured: boolean;
  userId: string | null;
  email: string | null;
  profile: Profile | null;
};

function mapProfile(row: Record<string, unknown> | null): Profile | null {
  if (!row) {
    return null;
  }

  return {
    userId: String(row.user_id),
    email: String(row.email),
    role: row.role as Role,
    displayName: String(row.display_name),
    active: Boolean(row.active),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function getRequestAuthContext(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<RequestAuthContext> {
  if (!hasSupabasePublicEnv()) {
    return {
      configured: false,
      userId: null,
      email: null,
      profile: null,
    };
  }

  const supabase = createSupabasePagesServerClient(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      userId: null,
      email: null,
      profile: null,
    };
  }

  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();

  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    profile: mapProfile((data as Record<string, unknown> | null) ?? null),
  };
}

export async function getPageAuthContext(context: GetServerSidePropsContext): Promise<RequestAuthContext> {
  if (!hasSupabasePublicEnv()) {
    return {
      configured: false,
      userId: null,
      email: null,
      profile: null,
    };
  }

  const supabase = createSupabasePagesServerClientFromContext(context);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      userId: null,
      email: null,
      profile: null,
    };
  }

  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();

  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    profile: mapProfile((data as Record<string, unknown> | null) ?? null),
  };
}

export async function requireRolePage(
  context: GetServerSidePropsContext,
  role: Role,
  loginPath: string,
): Promise<{ auth: RequestAuthContext } | GetServerSidePropsResult<Record<string, never>>> {
  const auth = await getPageAuthContext(context);

  if (!auth.configured) {
    return {
      redirect: {
        destination: loginPath,
        permanent: false,
      },
    };
  }

  if (!auth.userId || !auth.profile || !auth.profile.active || auth.profile.role !== role) {
    return {
      redirect: {
        destination: loginPath,
        permanent: false,
      },
    };
  }

  return { auth };
}

export async function redirectAuthenticatedLoginPage(
  context: GetServerSidePropsContext,
  role: Role,
  destination: string,
) {
  const auth = await getPageAuthContext(context);

  if (!auth.configured) {
    return null;
  }

  if (auth.userId && auth.profile?.active && auth.profile.role === role) {
    return {
      redirect: {
        destination,
        permanent: false,
      },
    } satisfies GetServerSidePropsResult<Record<string, never>>;
  }

  return null;
}

export async function signOutRequestSession(req: NextApiRequest, res: NextApiResponse) {
  if (!hasSupabasePublicEnv()) {
    return;
  }

  const supabase = createSupabasePagesServerClient(req, res);
  await supabase.auth.signOut();
}
