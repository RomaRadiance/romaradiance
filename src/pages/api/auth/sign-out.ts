import type { NextApiRequest, NextApiResponse } from "next";

import { signOutRequestSession } from "@/lib/auth-pages";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await signOutRequestSession(req, res);
  res.redirect(303, "/en");
}
