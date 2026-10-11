import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import {
  parsePortfolioFields,
  readRepositoryPortfolio,
} from "../src/lib/repository-portfolio";
import { getProjectCatalog } from "../src/lib/project-catalog";
import { repositoryMarkdownUrl } from "../src/components/repository-markdown";
import { RepositoryMarkdown } from "../src/components/repository-markdown";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getProjects } from "../src/lib/projects";
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
const response = (value: string) => ({
  ok: true,
  headers: new Headers(),
  text: async () => value,
});
describe("repository authored portfolio content", () => {
  it("fetches fresh authored files in development and keeps production caching", async () => {
    const fetch = vi.fn().mockImplementation(async () => response("{}"));
    vi.stubGlobal("fetch", fetch);
    vi.stubEnv("NODE_ENV", "development");
    await readRepositoryPortfolio({ name: "example", default_branch: "main" });
    expect(fetch.mock.calls[0][1].cache).toBe("no-store");
    expect(fetch.mock.calls[0][1]).not.toHaveProperty("next");
    fetch.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    await readRepositoryPortfolio({ name: "example", default_branch: "main" });
    expect(fetch.mock.calls[0][1].next.revalidate).toBe(3600);
    expect(fetch.mock.calls[0][1]).not.toHaveProperty("cache");
  });
  it("omits an existing evidence section and nested subsections while retaining later content", () => {
    const html = renderToStaticMarkup(
      createElement(RepositoryMarkdown, {
        project: {
          ...getProjects()[0],
          repository: "bryan034/example",
          caseStudy:
            "## Overview\n\nKeep overview.\n\n## Evidence & limitations\n\nRemove old evidence.\n\n### Tests\n\nRemove nested details.\n\n## Further development\n\nKeep future plans.",
        },
      }),
    );
    expect(html).toContain('id="overview"');
    expect(html).toContain('id="next"');
    expect(html).toContain("Keep future plans.");
    expect(html).not.toContain("Remove old evidence.");
    expect(html).not.toContain("Remove nested details.");
    expect(html).not.toContain("Evidence &amp; limitations");
  });
  it("accepts custom fields, ignores identity overrides, and falls back on invalid fields", () => {
    expect(
      parsePortfolioFields({
        version: 1,
        title: "Foodfolio",
        featured: false,
        visible: true,
        order: 2,
        role: "Sole developer",
        demoUrl: null,
        technologies: ["Python"],
        repository: "other/repo",
        slug: "other",
        summary: 7,
        status: "Unknown",
      }),
    ).toEqual({
      title: "Foodfolio",
      featured: false,
      visible: true,
      order: 2,
      role: "Sole developer",
      demoUrl: null,
      technologies: ["Python"],
    });
    expect(parsePortfolioFields({ version: 2, title: "Ignored" })).toEqual({});
  });
  it("reads both files from the default branch and handles missing files", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response('{"version":1,"title":"Foodfolio"}'))
      .mockResolvedValueOnce(response("## Overview\n\nDetails"));
    vi.stubGlobal("fetch", fetch);
    expect(
      await readRepositoryPortfolio({
        name: "food_account_outreach",
        default_branch: "main",
      }),
    ).toEqual({
      metadata: { title: "Foodfolio" },
      markdown: "## Overview\n\nDetails",
    });
    expect(fetch.mock.calls[0][0]).toContain(
      "/bryans_portfolio/portfolio.json",
    );
    expect(fetch.mock.calls[1][0]).toContain("/bryans_portfolio/case-study.md");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    expect(
      await readRepositoryPortfolio({
        name: "example",
        default_branch: "main",
      }),
    ).toEqual({ metadata: {}, markdown: undefined });
  });
  it("applies custom sorting and visibility while preserving stable routes", async () => {
    const repository = {
      id: 42,
      name: "example",
      full_name: "bryan034/example",
      owner: { login: "bryan034" },
      private: false,
      fork: false,
      description: "Default",
      language: "Python",
      topics: ["portfolio"],
      default_branch: "main",
    };
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(async (url: string) =>
          url.includes("api.github.com")
            ? { ok: true, json: async () => [repository] }
            : url.endsWith("portfolio.json")
              ? response(
                  '{"version":1,"title":"Custom name","order":1,"featured":false}',
                )
              : response("## Overview\n\nCustom article"),
        ),
    );
    const catalog = await getProjectCatalog();
    expect(catalog[0]).toMatchObject({
      slug: "github-example-42",
      title: "Custom name",
      order: 1,
      featured: false,
      caseStudy: "## Overview\n\nCustom article",
    });
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockImplementation(async (url: string) =>
          url.includes("api.github.com")
            ? { ok: true, json: async () => [repository] }
            : response('{"version":1,"visible":false}'),
        ),
    );
    expect(
      (await getProjectCatalog()).some((p) => p.slug === "github-example-42"),
    ).toBe(false);
  });
  it("resolves relative article links and blocks executable URLs", () => {
    expect(
      repositoryMarkdownUrl("../README.md", false, "bryan034/example", "main"),
    ).toBe("https://github.com/bryan034/example/blob/main/README.md");
    expect(
      repositoryMarkdownUrl("cover.png", true, "bryan034/example", "main"),
    ).toBe(
      "https://raw.githubusercontent.com/bryan034/example/main/bryans_portfolio/cover.png",
    );
    expect(
      repositoryMarkdownUrl(
        "javascript:alert(1)",
        false,
        "bryan034/example",
        "main",
      ),
    ).toBe("");
  });
});
