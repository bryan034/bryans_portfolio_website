import "server-only";
import { z } from "zod";
import { projectSchema } from "./projects";

const fields = projectSchema
  .pick({
    title: true,
    summary: true,
    category: true,
    role: true,
    technologies: true,
    status: true,
    featured: true,
    visible: true,
    order: true,
    coverAlt: true,
    coverCaption: true,
    contributions: true,
    contributionConfirmed: true,
  })
  .extend({ demoUrl: projectSchema.shape.demoUrl.nullable() })
  .partial();
export type PortfolioFields = z.infer<typeof fields>;

export function parsePortfolioFields(input: unknown): PortfolioFields {
  if (
    !input ||
    typeof input !== "object" ||
    !("version" in input) ||
    input.version !== 1
  )
    return {};
  const result: Record<string, unknown> = {};
  // Invalid fields fall back independently; one typo does not discard the rest.
  for (const [key, schema] of Object.entries(fields.shape)) {
    const value = (input as Record<string, unknown>)[key];
    if (value === undefined) continue;
    const parsed = schema.safeParse(value);
    if (parsed.success) result[key] = parsed.data;
  }
  return result as PortfolioFields;
}

async function readPublicFile(url: string, maxBytes: number) {
  try {
    const response = await fetch(url, {
      ...(process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } }),
      signal: AbortSignal.timeout(5000),
    });
    if (
      !response.ok ||
      Number(response.headers.get("content-length")) > maxBytes
    )
      return null;
    const text = await response.text();
    return new TextEncoder().encode(text).length <= maxBytes ? text : null;
  } catch {
    return null;
  }
}

export async function readRepositoryPortfolio(repository: {
  name: string;
  default_branch: string;
}) {
  const base = `https://raw.githubusercontent.com/bryan034/${encodeURIComponent(repository.name)}/${encodeURIComponent(repository.default_branch)}/bryans_portfolio/`;
  const [json, markdown] = await Promise.all([
    readPublicFile(`${base}portfolio.json`, 50_000),
    readPublicFile(`${base}case-study.md`, 200_000),
  ]);
  let metadata: PortfolioFields = {};
  if (json) {
    try {
      metadata = parsePortfolioFields(JSON.parse(json));
    } catch {
      /* use GitHub defaults */
    }
  }
  return { metadata, markdown: markdown?.trim() || undefined };
}
