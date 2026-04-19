import { describe, expect, it } from "vitest";

import { reviewSubmissionSchema } from "@/lib/validation/review";

describe("reviewSubmissionSchema", () => {
  it("accepts valid review payload", () => {
    const result = reviewSubmissionSchema.safeParse({
      parent_name: "Aditi Sharma",
      review_text: "Very supportive teaching and clear guidance for homework.",
      locale: "en",
      website: "",
    });

    expect(result.success).toBe(true);
  });

  it("rejects honeypot spam", () => {
    const result = reviewSubmissionSchema.safeParse({
      parent_name: "Aditi Sharma",
      review_text: "Helpful classes.",
      locale: "en",
      website: "spam",
    });

    expect(result.success).toBe(false);
  });

  it("rejects effectively empty text", () => {
    const result = reviewSubmissionSchema.safeParse({
      parent_name: "Aditi Sharma",
      review_text: "   ",
      locale: "en",
      website: "",
    });

    expect(result.success).toBe(false);
  });
});
