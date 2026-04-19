import type { NextApiRequest, NextApiResponse } from "next";

import { hasSupabaseServerEnv } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { reviewSubmissionSchema } from "@/lib/validation/review";

type ApiMessage = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiMessage>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  const ipHeader = req.headers["x-forwarded-for"];
  const ip = Array.isArray(ipHeader) ? ipHeader[0] : ipHeader?.split(",")[0]?.trim() || "unknown";
  const rateLimit = checkRateLimit(`review:${ip}`, 5, 1000 * 60 * 10);

  if (!rateLimit.allowed) {
    res.status(429).json({ message: "Too many submissions. Please try again later." });
    return;
  }

  const result = reviewSubmissionSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0]?.message || "Invalid review." });
    return;
  }

  if (!hasSupabaseServerEnv()) {
    res.status(503).json({ message: "Review flow is ready, but Supabase is not configured yet." });
    return;
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("reviews").insert({
    parent_name: result.data.parent_name,
    review_text: result.data.review_text,
    locale: result.data.locale,
    status: "pending",
  });

  if (error) {
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(201).json({ message: "Thank you. Your review is waiting for approval." });
}
