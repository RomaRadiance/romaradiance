import { expect, test } from "@playwright/test";

test("robots and sitemap endpoints respond correctly", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  await expect(await robots.text()).toContain("User-Agent: *");

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  await expect(await sitemap.text()).toContain("/en");
});

test("review API rejects invalid payload", async ({ request }) => {
  const response = await request.post("/api/reviews", {
    data: {
      parent_name: "",
      review_text: "bad",
      locale: "en",
      website: "",
    },
  });

  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.message).toBeTruthy();
});
