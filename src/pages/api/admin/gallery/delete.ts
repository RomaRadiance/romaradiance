import type { NextApiRequest, NextApiResponse } from "next";

import { AdminMutationError, deleteGalleryItem, requireAdminRequest } from "@/lib/admin-mutations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    await requireAdminRequest(req, res);
    await deleteGalleryItem(req.body as Record<string, unknown>);
    res.redirect(303, "/admin/gallery?message=Gallery%20item%20deleted.");
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/gallery?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
