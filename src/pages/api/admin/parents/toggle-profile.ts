import type { NextApiRequest, NextApiResponse } from "next";

import { AdminMutationError, requireAdminRequest, toggleParentProfileActive } from "@/lib/admin-mutations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    await requireAdminRequest(req, res);
    await toggleParentProfileActive(req.body as Record<string, unknown>);
    res.redirect(303, "/admin/parents?message=Parent%20updated.");
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/parents?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
