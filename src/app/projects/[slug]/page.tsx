import type { Metadata } from "next";
import { Gallery } from "@/components/gallery";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectCatalog, getCatalogProject } from "@/lib/project-catalog";
import { RepositoryCaseStudy } from "@/components/repository-case-study";
import { getCaseStudy } from "@/lib/case-studies";
import { getPublicRepository } from "@/lib/github";
import { OutArrow, RightArrow } from "@/components/icons";
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await getProjectCatalog()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getCatalogProject(slug);
  return project
    ? { title: project.title, description: project.summary }
    : { title: "Project not found" };
}
export default async function ProjectPage({
  //makes this component the default export for this file (page route /projects/[slug]) and marks it as an async function so it can handle async tasks like fetching data
  params, //destructures the param object from the props Next.js. destructuring props. Props stands for properties of an object
  // else function will look like this
  // `props` is a single argument passed by Next.js
  // export default async function ProjectPage(props) {
  //   const params = props.params; // Pulling params out of props
  //   const { slug } = await params;

  //   return <h1>Project: {slug}</h1>;
  // }
}: {
  params: Promise<{ slug: string }>; //ts type annotation, specifies that params is a Promise that resolves to an obj containing a str slug
  // dynamic route params and search params (params; searchParams) are treated as async Promises rather than synchronous objs
}) {
  const { slug } = await params;
  const project = await getCatalogProject(slug); //page retrieves the project metadata
  const Content = getCaseStudy(slug); //reach component containing mdx article
  if (!project || (!Content && project.source !== "github")) notFound(); // if either metadata or article is missing, displays 404
  const repository = await getPublicRepository(project.repository);
  const all = await getProjectCatalog();
  const next = all[(all.findIndex((p) => p.slug === slug) + 1) % all.length];
  return (
    <main id="main" className="wrap">
      <header className="case-header">
        <Link href="/projects" className="breadcrumb">
          ← Back to projects
        </Link>
        <p className="eyebrow">
          {project.category} / {project.status}
        </p>
        <h1>{project.title}</h1>
        <p className="page-intro">{project.summary}</p>
        <dl className="case-meta">
          <div>
            <dt>My role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Context</dt>
            <dd>
              {project.status}
              {project.status !== "Independent project" && " · SMU"}
            </dd>
          </div>
          {project.technologies.length > 0 && (
            <div>
              <dt>Technologies</dt>
              <dd>{project.technologies.join(" · ")}</dd>
            </div>
          )}
        </dl>
      </header>
      <Gallery
        className="case-cover"
        images={[
          {
            src: project.cover,
            alt: project.coverAlt,
            width: 720,
            height: 520,
            caption:
              project.coverCaption ??
              "Concept illustration of the project domain. Select to enlarge. Original screenshots and recordings will be added when available.",
          },
        ]}
      />
      <div className="case-body">
        <aside className="case-aside" aria-label="Case study navigation">
          <h2>In this case study</h2>
          <a href="#overview">Overview</a>
          <a href="#contribution">My contribution & context</a>
          <a href="#technical">Technical approach</a>
          <a href="#evidence">Evidence & limitations</a>
          <a href="#next">Further development</a>
          {!project.contributionConfirmed && project.source !== "github" && (
            <p className="contribution-note">
              Résumé-backed summary. The exact division of work within the
              project team is still being documented.
            </p>
          )}
          {repository && (
            <div className="repository-info">
              <a href={repository.url} target="_blank" rel="noreferrer">
                View repository <OutArrow />
              </a>
              {repository.language && <p>{repository.language}</p>}
              {repository.archived && <p>Archived repository</p>}
              {repository.updatedAt &&
                !Number.isNaN(Date.parse(repository.updatedAt)) && (
                  <p>
                    Last code activity:{" "}
                    {new Date(repository.updatedAt).toLocaleDateString(
                      "en-SG",
                      {
                        month: "short",
                        year: "numeric",
                        timeZone: "Asia/Singapore",
                      },
                    )}
                  </p>
                )}
            </div>
          )}
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          )}
        </aside>
        <article className="prose">
          {Content ? <Content /> : <RepositoryCaseStudy project={project} />}
        </article>
      </div>
      <div className="case-bottom">
        <Link className="text-link" href="/projects">
          ← All projects
        </Link>
        <Link className="text-link" href={`/projects/${next.slug}`}>
          Next: {next.title} <RightArrow />
        </Link>
      </div>
    </main>
  );
}
