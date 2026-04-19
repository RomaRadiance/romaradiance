import type { NextApiRequest, NextApiResponse } from "next";

import { requireAdminRequest } from "@/lib/admin-mutations";
import { AdminMutationError, updateSiteContent } from "@/lib/admin-mutations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    await requireAdminRequest(req, res);
    await updateSiteContent(req.body as Record<string, unknown>);
    res.redirect(303, "/admin/content?message=Content%20updated.");
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/content?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
