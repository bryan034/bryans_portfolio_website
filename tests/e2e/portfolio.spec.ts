import { expect, test } from "@playwright/test";
test("hirer can navigate from skills to project details", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Bryan Chang",
  );
  const portrait = page.locator(".hero-portrait img");
  await expect(portrait).toHaveAttribute("src", /bryan-chang(?:%2E|\.)png/);
  await page.getByRole("link", { name: "Explore the ML project" }).click();
  await expect(page).toHaveURL(/\/projects\/credit-risk$/);
  await expect(
    page.getByRole("heading", { name: "My contribution & project context" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Enlarge:/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("link", { name: "Back to projects" }).click();
  await expect(page.locator(".project-card").first()).toBeVisible();
  expect(await page.locator(".project-card").count()).toBeGreaterThanOrEqual(3);
  await expect(page.locator('a[href="/resume"]')).toHaveCount(0);
  const removed = await page.goto("/resume");
  expect(removed?.status()).toBe(404);
});
test("all case studies render and missing slugs return 404", async ({
  page,
}) => {
  await page.goto("/projects");
  const links = await page
    .locator(".project-card h3 a")
    .evaluateAll((items) => items.map((a) => a.getAttribute("href")!));
  for (const link of links) {
    const slug = link.split("/").pop();
    const response = await page.goto(link);
    expect(response?.status()).toBe(200);
    await expect(page.locator("#overview")).toBeVisible();
    await expect(page.locator("#evidence")).toHaveCount(0);
    await expect(page.locator("#next")).toHaveText("Further development");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    if (slug === "travel-booking")
      await page.screenshot({
        path: `test-results/case-study-${test.info().project.name}.png`,
        fullPage: true,
      });
  }
  const excluded = await page.goto("/projects/meal-planning");
  expect(excluded?.status()).toBe(404);
  const missing = await page.goto("/projects/not-a-project");
  expect(missing?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "This page took",
  );
});
test("layout fits the viewport, contact works, and phone is absent", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect(
    page.getByRole("link", { name: "Email me", exact: false }),
  ).toHaveAttribute("href", "mailto:changjieruibryan@gmail.com");
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(
    /\+65[\s-]?\d{4}[\s-]?\d{4}/,
  );
  await page.locator("#experience details").nth(1).locator("summary").click();
  await expect(page.locator("#experience details").nth(1)).toHaveAttribute(
    "open",
    "",
  );
  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: `test-results/home-viewport-${test.info().project.name}.png`,
  });
});
