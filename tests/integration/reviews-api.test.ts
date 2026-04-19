import { describe, expect, it } from "vitest";

import handler from "@/pages/api/reviews";

function createMockResponse() {
  const result: {
    statusCode: number;
    headers: Record<string, string | string[]>;
    jsonBody: unknown;
    status: (code: number) => typeof result;
    setHeader: (name: string, value: string | string[]) => void;
    json: (body: unknown) => void;
  } = {
    statusCode: 200,
    headers: {},
    jsonBody: null,
    status(code: number) {
      result.statusCode = code;
      return result;
    },
    setHeader(name: string, value: string | string[]) {
      result.headers[name] = value;
    },
    json(body: unknown) {
      result.jsonBody = body;
    },
  };

  return result;
}

describe("pages api reviews", () => {
  it("rejects invalid payload", async () => {
    const req = {
      method: "POST",
      body: {
        parent_name: "",
        review_text: "bad",
        locale: "en",
        website: "",
      },
      headers: {},
    };

    const res = createMockResponse();

    await handler(req as never, res as never);

    expect(res.statusCode).toBe(400);
    expect(res.jsonBody).toMatchObject({ message: expect.any(String) });
  });
});
