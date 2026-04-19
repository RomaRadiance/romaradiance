import type { NextApiRequest, NextApiResponse } from "next";

import { AdminMutationError, requireAdminRequest, updateReviewStatus } from "@/lib/admin-mutations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const auth = await requireAdminRequest(req, res);
    await updateReviewStatus(req.body as Record<string, unknown>, auth.userId!);
    res.redirect(303, `/admin/reviews?message=${encodeURIComponent(`Review ${String(req.body.status || "updated")}.`)}`);
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/reviews?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
