import "server-only";
import { z } from "zod";
import { repositoryIdPattern } from "./repository-id";

const repoSchema = z.object({
  private: z.literal(false),
  full_name: z.string(),
  html_url: z.string().url(),
  language: z.string().nullable(),
  topics: z.array(z.string()).optional(),
  pushed_at: z.string().nullable(),
  archived: z.boolean(),
  stargazers_count: z.number(),
});
export type RepositoryInfo = {
  url: string;
  language: string | null;
  topics: string[];
  updatedAt: string | null;
  archived: boolean;
};

// Enrich a single public repository; discovery below is limited to Bryan's account.
export async function getPublicRepository(
  repository?: string,
): Promise<RepositoryInfo | null> {
  if (!repository || !repositoryIdPattern.test(repository)) return null;
  try {
    const response = await fetch(`https://api.github.com/repos/${repository}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const result = repoSchema.safeParse(await response.json());
    if (!result.success) return null;
    const data = result.data;
    if (data.full_name.toLowerCase() !== repository.toLowerCase()) return null;
    // Derive the URL from the curated identifier rather than trusting an API URL.
    return {
      url: `https://github.com/${repository}`,
      language: data.language,
      topics: data.topics ?? [],
      updatedAt: data.pushed_at,
      archived: data.archived,
    };
  } catch {
    return null;
  }
}

const portfolioRepositorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  full_name: z.string().regex(repositoryIdPattern),
  owner: z.object({ login: z.string() }),
  private: z.boolean(),
  fork: z.boolean(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  default_branch: z.string().min(1),
});
export type PortfolioRepository = z.infer<typeof portfolioRepositorySchema> & {
  cover: string | null;
};

function githubOptions() {
  return {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
  };
}

function getRepositoryCover(
  repository: z.infer<typeof portfolioRepositorySchema>,
) {
  // This fixed public path needs no GitHub Contents API request. The image
  // component falls back to the themed placeholder if the file is absent.
  return `https://raw.githubusercontent.com/bryan034/${encodeURIComponent(repository.name)}/${encodeURIComponent(repository.default_branch)}/portfolio_cover_photo/cover.png`;
}

export async function getPortfolioRepositories(): Promise<
  PortfolioRepository[]
> {
  try {
    const selected: z.infer<typeof portfolioRepositorySchema>[] = [];
    // GitHub returns at most 100 repositories per page. Fetch every page so
    // qualifying projects do not disappear as the account grows.
    for (let page = 1; ; page++) {
      const response = await fetch(
        `https://api.github.com/users/bryan034/repos?type=owner&sort=full_name&per_page=100&page=${page}`,
        githubOptions(),
      );
      if (!response.ok) throw new Error("GitHub discovery unavailable");
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid repository list");
      for (const item of data) {
        const result = portfolioRepositorySchema.safeParse(item);
        if (!result.success) continue;
        const r = result.data;
        if (
          !r.private &&
          !r.fork &&
          r.owner.login.toLowerCase() === "bryan034" &&
          r.full_name.toLowerCase() === `bryan034/${r.name}`.toLowerCase() &&
          r.topics.includes("portfolio")
        )
          selected.push(r);
      }
      if (data.length < 100) break;
    }
    const unique = [...new Map(selected.map((r) => [r.id, r])).values()];
    return unique.map((r) => ({ ...r, cover: getRepositoryCover(r) }));
  } catch {
    // GitHub problems must not prevent curated projects or other pages rendering.
    return [];
  }
}
