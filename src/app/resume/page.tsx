import type { Metadata } from "next";
import { profile, experiences } from "@/lib/profile";
import { getProjectCatalog } from "@/lib/project-catalog";
import { PrintButton } from "@/components/print-button";
export const metadata: Metadata = { title: "Resume" };
export const revalidate = 3600;
export default async function Resume() {
  const projects = await getProjectCatalog();
  return (
    <main id="main" className="wrap resume-page">
      <p className="resume-label">Resume</p>
      <h1>Bryan Chang</h1>
      <p className="page-intro">
        Information Systems undergraduate · Singapore
      </p>
      <div className="resume-contact">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          linkedin.com/in/bryanchangg ↗
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          github.com/bryan034 ↗
        </a>
      </div>
      <div className="resume-actions">
        <p>Education, experience, projects, and skills.</p>
        <PrintButton />
      </div>
      <section>
        <h2>Education</h2>
        <article>
          <div className="resume-entry-head">
            <h3>Singapore Management University</h3>
            <span>2024 — 2028 (expected)</span>
          </div>
          <p>
            BSc Information Systems · Business Analytics & Product Development
          </p>
          <ul>
            <li>Global Impact Scholarship Award</li>
            <li>Dean’s List for all applicable semesters</li>
            <li>Cumulative GPA: 4.00 / 4.00</li>
          </ul>
        </article>
        <article>
          <div className="resume-entry-head">
            <h3>Anglo-Chinese School (Independent)</h3>
            <span>2016 — 2021</span>
          </div>
          <p>International Baccalaureate · 44 / 45 points</p>
        </article>
      </section>
      <section>
        <h2>Experience</h2>
        {experiences.map((e) => (
          <article key={e.company}>
            <div className="resume-entry-head">
              <h3>
                {e.company} · {e.role}
              </h3>
              <span>{e.date}</span>
            </div>
            <p>{e.summary}</p>
            <ul>
              {e.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section>
        <h2>Selected projects</h2>
        {projects.map((p) => (
          <article key={p.slug}>
            <h3>
              <a href={`/projects/${p.slug}`}>{p.title} ↗</a>
            </h3>
            <p>{p.summary}</p>
            <p>{p.role}</p>
            {p.technologies.length > 0 && <p>{p.technologies.join(" · ")}</p>}
          </article>
        ))}
      </section>
      <section>
        <h2>Skills & interests</h2>
        <div className="resume-skills">
          <article>
            <h3>AI & data</h3>
            <p>
              Prompt engineering, LLM evaluation, agentic AI, AI governance,
              supervised and unsupervised learning, Python (Pandas, NumPy), SQL.
            </p>
          </article>
          <article>
            <h3>Web & systems</h3>
            <p>
              Java, PHP, JavaScript, Vue.js, HTML/CSS, MySQL, REST APIs, Docker,
              Microsoft Azure, Odoo ERP.
            </p>
          </article>
          <article>
            <h3>Business & analytics</h3>
            <p>
              Excel (Advanced, VBA), Tableau, financial modelling, product
              strategy, customer discovery, business requirements, UAT.
            </p>
          </article>
          <article>
            <h3>Beyond the technical</h3>
            <p>
              English (fluent), Chinese (intermediate). Travelling, tennis,
              Hyrox, and poker.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
