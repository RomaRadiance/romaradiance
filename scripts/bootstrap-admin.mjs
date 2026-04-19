import { createClient } from "@supabase/supabase-js";

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_BOOTSTRAP_EMAIL",
  "ADMIN_BOOTSTRAP_PASSWORD",
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const displayName = process.env.ADMIN_BOOTSTRAP_NAME || "Roma Admin";

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: {
    role: "admin",
  },
  user_metadata: {
    display_name: displayName,
  },
});

if (error) {
  throw error;
}

if (!data.user) {
  throw new Error("Admin user creation returned no user");
}

const { error: profileError } = await supabase.from("profiles").upsert({
  user_id: data.user.id,
  email,
  role: "admin",
  display_name: displayName,
  active: true,
});

if (profileError) {
  throw profileError;
}

console.log(`Admin bootstrapped for ${email}`);
