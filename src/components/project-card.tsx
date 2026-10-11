import { ProjectImage as Image } from "./project-image";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { OutArrow } from "./icons";
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <article className="project-card">
      <Link
        href={`/projects/${project.slug}`} //each card links to a url built from project's slug
        className="project-cover"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={project.cover}
          alt=""
          width={720}
          height={520}
          sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
        />
        <span className="cover-open">
          <OutArrow size={22} />
        </span>
        <span className="cover-caption">
          {project.coverCaption ?? "Concept illustration"}
        </span>
      </Link>
      <div className="project-topline">
        <span>
          {String(index + 1).padStart(2, "0")} / {project.category}
        </span>
        <span className="tiny-dot" aria-hidden="true" />
      </div>
      <h3>
        <Link href={`/projects/${project.slug}`}>
          {project.title}
          <OutArrow />
        </Link>
      </h3>
      <p className="project-summary">{project.summary}</p>
      <div className="tags">
        {project.technologies.slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <p className="project-role">
        {project.role} <span>· {project.status}</span>
      </p>
    </article>
  );
}
