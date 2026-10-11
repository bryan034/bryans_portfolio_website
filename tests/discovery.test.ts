import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getPortfolioRepositories } from "../src/lib/github";
import { getProjectCatalog } from "../src/lib/project-catalog";
const repo = {
  id: 42,
  name: "example_project",
  full_name: "bryan034/example_project",
  owner: { login: "bryan034" },
  private: false,
  fork: false,
  description: "A project description",
  language: "Python",
  topics: ["portfolio", "ocr"],
  default_branch: "main",
};
const ok = (data: unknown) => ({ ok: true, json: async () => data });
afterEach(() => vi.unstubAllGlobals());
describe("portfolio discovery", () => {
  it("filters private, forked, untagged, foreign, and malformed repositories", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          ok([
            repo,
            { ...repo, private: true },
            { ...repo, fork: true },
            { ...repo, topics: [] },
            { ...repo, owner: { login: "other" } },
            { id: 9 },
          ]),
        )
        .mockResolvedValue({ ok: false }),
    );
    const results = await getPortfolioRepositories();
    expect(results).toHaveLength(1);
    expect(results[0].cover).toBe(
      "https://raw.githubusercontent.com/bryan034/example_project/main/bryans_portfolio/cover.png",
    );
  });
  it("fetches later pages and validates the cover URL", async () => {
    const cover =
      "https://raw.githubusercontent.com/bryan034/example_project/main/bryans_portfolio/cover.png";
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(
        ok(
          Array.from({ length: 100 }, (_, i) => ({
            ...repo,
            id: i + 100,
            topics: [],
          })),
        ),
      )
      .mockResolvedValueOnce(ok([repo]))
      .mockResolvedValueOnce(
        ok({
          type: "file",
          path: "portfolio_cover_photo/cover.png",
          download_url: cover,
        }),
      );
    vi.stubGlobal("fetch", fetch);
    expect((await getPortfolioRepositories())[0].cover).toBe(cover);
    expect(fetch.mock.calls[1][0]).toContain("page=2");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  it("derives covers from the fixed GitHub path rather than API supplied URLs", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(ok([repo]))
        .mockResolvedValueOnce(
          ok({
            type: "file",
            path: "portfolio_cover_photo/cover.png",
            download_url: "https://other.example/cover.png",
          }),
        ),
    );
    expect((await getPortfolioRepositories())[0].cover).toBe(
      "https://raw.githubusercontent.com/bryan034/example_project/main/bryans_portfolio/cover.png",
    );
  });
  it("merges discovered projects with curated records without requiring MDX", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(ok([repo]))
        .mockResolvedValue({ ok: false }),
    );
    const projects = await getProjectCatalog();
    const discovered = projects.find((p) => p.repository === repo.full_name)!;
    expect(discovered.slug).toBe("github-example-project-42");
    expect(discovered.featured).toBe(true);
    expect(discovered.cover).toContain("/bryans_portfolio/cover.png");
    expect(discovered.source).toBe("github");
    expect(projects.some((p) => p.slug === "credit-risk")).toBe(true);
    expect(
      projects.some((p) => ["foodie-connect", "fault-report"].includes(p.slug)),
    ).toBe(false);
  });
  it("keeps curated work available during GitHub failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await getPortfolioRepositories()).toEqual([]);
    expect((await getProjectCatalog()).map((p) => p.slug)).toEqual([
      "travel-booking",
      "odoo-azure",
      "credit-risk",
    ]);
  });
});
