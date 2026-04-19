import type { NextApiRequest, NextApiResponse } from "next";

import { AdminMutationError, requireAdminRequest, saveWhyChoose } from "@/lib/admin-mutations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    await requireAdminRequest(req, res);
    await saveWhyChoose(req.body as Record<string, unknown>);
    res.redirect(303, "/admin/offerings?message=Why%20Choose%20item%20saved.");
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/offerings?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
