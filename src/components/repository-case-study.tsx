import type { Project } from "@/lib/projects";

export function RepositoryCaseStudy({ project }: { project: Project }) {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>{project.summary}</p>
      <h2 id="contribution">My contribution & project context</h2>
      <p>
        This project is published on my GitHub account. Its README provides the
        project context and implementation details.
      </p>
      <h2 id="technical">Technical approach</h2>
      <p>
        {project.technologies.length
          ? `Repository language and topics: ${project.technologies.join(", ")}.`
          : "Explore the repository for the architecture, setup instructions, and source code."}
      </p>
      <h2 id="evidence">Evidence & limitations</h2>
      <p>
        <a
          href={`https://github.com/${project.repository}`}
          target="_blank"
          rel="noreferrer"
        >
          View source code and README ↗
        </a>
      </p>
      <p>
        The overview reflects the repository description. Detailed contribution
        and outcome evidence is available in the project documentation.
      </p>
      <h2 id="next">Further development</h2>
      <p>See the repository README and issues for current development plans.</p>
    </>
  );
}
