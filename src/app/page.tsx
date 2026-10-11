import Link from "next/link";
import Image from "next/image";
import { getHomepageProjects } from "@/lib/project-catalog";
import { experiences, profile } from "@/lib/profile";
import { ProjectCard } from "@/components/project-card";
import {
  OutArrow,
  DownArrow,
  RightArrow,
  EmailIcon,
  GitHubLogo,
  LinkedInLogo,
} from "@/components/icons";

export const revalidate = 3600;
export default async function Home() {
  const featured = await getHomepageProjects();
  return (
    <main id="main">
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-portrait">
          <Image
            src="/images/bryan-chang.jpg"
            alt="Bryan Chang"
            fill
            sizes="(max-width: 760px) 240px, (max-width: 1050px) 300px, 380px"
            priority
          />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> AI · Software · Product
          </p>
          <h1 id="hero-title">Bryan Chang</h1>
          <p className="hero-subtitle">
            Shipping Products. Scaling Intelligence.
          </p>
          <p className="hero-description">
            Information Systems undergraduate at SMU, graduating in 2028.
            Building practical solutions to solve pain points.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#work">
              View projects <DownArrow />
            </a>
            <Link className="button button-outline" href="/resume">
              Resume
            </Link>
            <a
              className="text-link hero-github"
              href={profile.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub <OutArrow />
            </a>
          </div>
          <p className="hero-note">
            Seeking roles in Applied AI & Software Engineering
          </p>
        </div>
      </section>

      <div className="intro-strip wrap">
        <p>Based in Singapore</p>
        <div>
          <span>Studying at</span>
          <strong>Singapore Management University</strong>
        </div>
        <div>
          <span>Currently exploring</span>
          <strong>Agentic AI & Product Development</strong>
        </div>
      </div>

      <section
        id="work"
        className="section wrap"
        aria-labelledby="work-heading"
      >
        <div className="section-head">
          <div>
            <p className="eyebrow">01 / Selected work</p>
            <h2 id="work-heading">Selected projects</h2>
          </div>
          <Link href="/projects" className="text-link">
            All projects <RightArrow />
          </Link>
        </div>
        <p className="section-intro">
          Selected independent and academic projects, with a clear view of the
          work I personally owned.
        </p>
        <div className="project-grid">
          {featured.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.slug} />
          ))}
        </div>
      </section>

      <section
        id="experience"
        className="experience-section"
        aria-labelledby="experience-heading"
      >
        <div className="wrap experience-layout">
          <div className="experience-heading">
            <p className="eyebrow">02 / Experience</p>
            <h2 id="experience-heading">Experience</h2>
            <p>
              From Agentic AI in healthcare to an early-stage venture, I’ve
              worked at the intersection of technology, people, and business.
            </p>
            <Link href="/resume" className="text-link">
              View resume <OutArrow />
            </Link>
          </div>
          <div className="experience-list">
            {experiences.map((exp, index) => (
              <details
                key={exp.company}
                className="experience-item"
                open={index === 0}
              >
                <summary>
                  <div>
                    <span className="experience-date">{exp.date}</span>
                    <h3>{exp.company}</h3>
                    <p>{exp.role}</p>
                  </div>
                  <span className="expand-symbol" aria-hidden="true" />
                </summary>
                <div className="experience-body">
                  <p>{exp.summary}</p>
                  <ul>
                    {exp.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="skills-heading">
        <div className="section-head">
          <div>
            <p className="eyebrow">03 / Capabilities</p>
            <h2 id="skills-heading">Skills & capabilities</h2>
          </div>
          <p className="section-aside">
            Technical foundations.
            <br />
            Product and business context.
          </p>
        </div>
        <div className="capability-grid">
          <article>
            <span className="capability-number">01</span>
            <h3>AI & Machine Learning</h3>
            <p>
              Model evaluation, agentic AI, supervised learning and prompt
              engineering.
            </p>
            <Link href="/projects/credit-risk" className="text-link">
              Explore the ML project <OutArrow size={15} />
            </Link>
          </article>
          <article>
            <span className="capability-number">02</span>
            <h3>Software & Systems</h3>
            <p>
              Full Stack Development, Docker, API Gateways, DevOps on Microsoft
              Azure.
            </p>
            <Link href="/projects/travel-booking" className="text-link">
              Explore the systems project <OutArrow size={15} />
            </Link>
          </article>
          <article>
            <span className="capability-number">03</span>
            <h3>Product Development & Analytics</h3>
            <p>
              Customer discovery, GTM, financial modelling, and data analytics.
            </p>
            <a href="#experience" className="text-link">
              Explore my experience <OutArrow size={15} />
            </a>
          </article>
        </div>
      </section>

      <section
        id="about"
        className="about-section wrap"
        aria-labelledby="about-heading"
      >
        <div className="about-label">
          <p className="eyebrow">04 / About</p>
        </div>
        <div className="about-copy">
          <h2 id="about-heading">
            Technical foundation.
            <br />
            Product perspective.
          </h2>
          <p>
            I’m studying Information Systems at SMU, majoring in Product
            Development and Business Analytics, with expected graduation in
            2028. I bridge the gap between complex problems and technical
            solutions by grounding product decisions in user needs and
            real-world impact.
          </p>
          <p>
            Outside of work and school, you’ll find me travelling, playing
            tennis, or trying out new food places{" "}
            <i>(if you have any recommendations let me know)!</i>
          </p>
          <div className="about-facts">
            <span>Sports Enthusiast</span>
            <span>Travelling</span>
            <span>Food Reviewer</span>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section"
        aria-labelledby="contact-heading"
      >
        <div className="wrap">
          <p className="eyebrow">Let’s connect</p>
          <div className="contact-top">
            <h2 id="contact-heading">Let’s build something useful.</h2>
            <a
              href={`mailto:${profile.email}`}
              className="contact-arrow"
              aria-label="Email Bryan Chang"
            >
              <OutArrow size={46} />
            </a>
          </div>
          <div className="contact-bottom">
            <p>Open to AI and software engineering opportunities.</p>
            <div>
              <a href={`mailto:${profile.email}`}>
                Email me <EmailIcon />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub <GitHubLogo />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn <LinkedInLogo />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
