import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export function parsePublicEnv(input: NodeJS.ProcessEnv) {
  return publicEnvSchema.safeParse(input);
}

export function parseServerEnv(input: NodeJS.ProcessEnv) {
  return serverEnvSchema.safeParse(input);
}

export function hasSupabasePublicEnv() {
  return parsePublicEnv(process.env).success;
}

export function hasSupabaseServerEnv() {
  return parseServerEnv(process.env).success;
}

export function getPublicEnv() {
  const result = parsePublicEnv(process.env);

  if (!result.success) {
    throw new Error(`Missing public environment variables: ${result.error.message}`);
  }

  return result.data;
}

export function getServerEnv() {
  const result = parseServerEnv(process.env);

  if (!result.success) {
    throw new Error(`Missing server environment variables: ${result.error.message}`);
  }

  return result.data;
}

export function getOptionalSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
