import "server-only";
import { cache } from "react";
import { getPortfolioRepositories } from "./github";
import { readRepositoryPortfolio } from "./repository-portfolio";
import { getProjects, validateProjects, type Project } from "./projects";

// Keep curated work (including repositories owned by teammates), then discover
// public projects opted in through the portfolio topic on Bryan's account.
export const getProjectCatalog = cache(async (): Promise<Project[]> => {
  const curated = getProjects();
  const repositories = await getPortfolioRepositories();
  const known = new Set(curated.map((p) => p.repository?.toLowerCase()));
  const discovered: Project[] = await Promise.all(
    repositories
      .filter((r) => !known.has(r.full_name.toLowerCase()))
      .map(async (r, index) => {
        const { metadata, markdown } = await readRepositoryPortfolio(r);
        return {
          slug: `github-${
            r.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "") || "project"
          }-${r.id}`,
          title: r.name.replace(/[-_]+/g, " "),
          summary:
            r.description?.trim() ||
            "Explore the implementation and documentation on GitHub.",
          category: "GitHub project",
          role: "Repository owner",
          technologies: [
            ...new Set([
              ...(r.language ? [r.language] : []),
              ...r.topics.filter((t) => t !== "portfolio"),
            ]),
          ],
          status: "Independent project",
          source: "github",
          featured: true,
          visible: true,
          order: 100 + index,
          cover: r.cover ?? "/images/project-placeholder.svg",
          coverAlt: r.cover
            ? `${r.name} project cover`
            : "Project cover placeholder",
          coverCaption: r.cover
            ? "Repository cover"
            : "Project cover coming soon",
          repository: r.full_name,
          contributions: [],
          contributionConfirmed: false,
          ...metadata,
          demoUrl: metadata.demoUrl ?? undefined,
          caseStudy: markdown,
          repositoryBranch: r.default_branch,
        };
      }),
  );
  return validateProjects([...curated, ...discovered])
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
});

export async function getCatalogProject(slug: string) {
  return (await getProjectCatalog()).find((p) => p.slug === slug);
}

export async function getHomepageProjects() {
  const projects = await getProjectCatalog();
  // Homepage selection is curated independently of GitHub's featured setting.
  // Match Foodfolio by repository so its title or generated slug can change.
  return [
    projects.find(
      (p) => p.repository?.toLowerCase() === "bryan034/food_account_outreach",
    ),
    projects.find((p) => p.slug === "odoo-azure"),
    projects.find((p) => p.slug === "credit-risk"),
  ].filter((p): p is Project => p !== undefined);
}
