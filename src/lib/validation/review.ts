import { z } from "zod";

import { isLocale } from "@/lib/i18n";

export const reviewSubmissionSchema = z
  .object({
    parent_name: z
      .string()
      .trim()
      .min(2, "Name is required")
      .max(80, "Name must be 80 characters or less"),
    review_text: z
      .string()
      .trim()
      .min(20, "Review must be at least 20 characters")
      .max(600, "Review must be 600 characters or less"),
    locale: z.string().refine((value) => isLocale(value), "Invalid locale"),
    website: z.string().max(0, "Spam detected").default(""),
  })
  .refine((value) => value.review_text.replace(/\s/g, "").length > 0, {
    message: "Review cannot be empty",
    path: ["review_text"],
  });

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
