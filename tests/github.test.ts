import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { getPublicRepository } from "../src/lib/github";
const response = {
  private: false,
  full_name: "bryan/example",
  html_url: "https://github.com/bryan/example",
  language: "Python",
  topics: ["ml"],
  pushed_at: "2026-06-01T00:00:00Z",
  archived: false,
  stargazers_count: 0,
};
afterEach(() => vi.unstubAllGlobals());
describe("optional GitHub enrichment", () => {
  it("only fetches explicitly selected valid repositories", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect(await getPublicRepository()).toBeNull();
    expect(await getPublicRepository("../private")).toBeNull();
    expect(await getPublicRepository("bryan/..")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects private, malformed, and mismatched responses", async () => {
    for (const data of [
      { ...response, private: true },
      { ...response, full_name: "other/private" },
      { message: "Bad response" },
    ]) {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok: true, json: async () => data }),
      );
      expect(await getPublicRepository("bryan/example")).toBeNull();
    }
  });
  it("degrades gracefully for rate limits and network failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 403 }),
    );
    expect(await getPublicRepository("bryan/example")).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await getPublicRepository("bryan/example")).toBeNull();
  });
  it("returns only public metadata, with explicit caching and no automatic demo", async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ...response,
        homepage: "https://unverified.example",
      }),
    });
    vi.stubGlobal("fetch", fetch);
    const data = await getPublicRepository("bryan/example");
    expect(data?.url).toBe("https://github.com/bryan/example");
    expect(data).not.toHaveProperty("homepage");
    expect(data).not.toHaveProperty("token");
    expect(fetch.mock.calls[0][1].next.revalidate).toBe(3600);
  });
});
