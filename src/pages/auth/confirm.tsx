import type { GetServerSideProps } from "next";

import { hasSupabasePublicEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePagesServerClientFromContext } from "@/lib/supabase/pages-server";
import { safeRedirect } from "@/lib/utils";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirectTo = safeRedirect(
    typeof context.query.next === "string" ? context.query.next : null,
    "/parent/gallery",
  );

  if (!hasSupabasePublicEnv()) {
    return {
      redirect: {
        destination: "/auth/error?message=Supabase%20not%20configured",
        permanent: false,
      },
    };
  }

  const code = typeof context.query.code === "string" ? context.query.code : null;
  const tokenHash = typeof context.query.token_hash === "string" ? context.query.token_hash : null;
  const type = typeof context.query.type === "string" ? context.query.type : "email";
  const supabase = createSupabasePagesServerClientFromContext(context);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return {
        redirect: {
          destination: `/auth/error?message=${encodeURIComponent(error.message)}`,
          permanent: false,
        },
      };
    }
  } else if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "invite" | "magiclink",
    });

    if (error) {
      return {
        redirect: {
          destination: `/auth/error?message=${encodeURIComponent(error.message)}`,
          permanent: false,
        },
      };
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      redirect: {
        destination: "/auth/error?message=Unable%20to%20sign%20in",
        permanent: false,
      },
    };
  }

  const adminClient = createSupabaseAdminClient();
  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { data: invite } = await adminClient
      .from("parent_invites")
      .select("display_name, active")
      .eq("email", user.email)
      .maybeSingle();

    if (invite?.active) {
      await adminClient.from("profiles").upsert({
        user_id: user.id,
        email: user.email,
        role: "parent",
        display_name: String(invite.display_name),
        active: true,
      });
    }
  }

  const { data: profile } = await adminClient
    .from("profiles")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.active) {
    return {
      redirect: {
        destination: "/auth/error?message=Your%20account%20is%20inactive",
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: profile.role === "admin" ? "/admin" : redirectTo,
      permanent: false,
    },
  };
};

export default function AuthConfirmPage() {
  return null;
}
