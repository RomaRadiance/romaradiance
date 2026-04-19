import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "node:fs/promises";

import { AdminMutationError, requireAdminRequest, uploadGalleryItem } from "@/lib/admin-mutations";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = await requireAdminRequest(req, res);
    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await form.parse(req);
    const fileValue = files.file;
    const uploaded = Array.isArray(fileValue) ? fileValue[0] : fileValue;

    if (!uploaded) {
      throw new AdminMutationError("Please choose an image file.");
    }

    const fileBuffer = await fs.readFile(uploaded.filepath);
    const file = new File([new Uint8Array(fileBuffer)], uploaded.originalFilename || "gallery-image", {
      type: uploaded.mimetype || "image/jpeg",
    });

    await uploadGalleryItem({
      file,
      values: {
        captionEn: Array.isArray(fields.captionEn) ? fields.captionEn[0] : fields.captionEn,
        captionHi: Array.isArray(fields.captionHi) ? fields.captionHi[0] : fields.captionHi,
        altTextEn: Array.isArray(fields.altTextEn) ? fields.altTextEn[0] : fields.altTextEn,
        altTextHi: Array.isArray(fields.altTextHi) ? fields.altTextHi[0] : fields.altTextHi,
        displayDate: Array.isArray(fields.displayDate) ? fields.displayDate[0] : fields.displayDate,
        sortOrder: Array.isArray(fields.sortOrder) ? fields.sortOrder[0] : fields.sortOrder,
        active: Array.isArray(fields.active) ? fields.active[0] : fields.active,
      },
      uploadedBy: auth.userId!,
    });

    res.redirect(303, "/admin/gallery?message=Gallery%20image%20uploaded.");
  } catch (error) {
    if (error instanceof AdminMutationError) {
      res.redirect(303, `/admin/gallery?message=${encodeURIComponent(error.message)}`);
      return;
    }

    throw error;
  }
}
