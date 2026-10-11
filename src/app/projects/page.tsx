import type { Metadata } from "next";
import { getProjectCatalog } from "@/lib/project-catalog";
import { ProjectCard } from "@/components/project-card";
export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected independent and academic projects in machine learning, software, distributed systems, and cloud deployment.",
};
export const revalidate = 3600;
export default async function Projects() {
  const projects = await getProjectCatalog();
  return (
    <main id="main" className="wrap projects-page">
      <p className="eyebrow">The project collection</p>
      <h1>Projects</h1>
      <p className="page-intro">
        From building a credit scorecard to connecting independent services.
        Selected independent and academic projects, with the context and
        personal contribution behind each one.
      </p>
      <div className="collection-heading">
        <span>Selected projects</span>
        <span>{String(projects.length).padStart(2, "0")} projects</span>
      </div>
      <div className="project-grid collection-grid">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </main>
  );
}
