import Link from "next/link";
import { OutArrow } from "./icons";
import { profile } from "@/lib/profile";
export function Header() {
  return (
    <header className="site-header wrap">
      <Link href="/" className="wordmark" aria-label="Bryan Chang home">
        Bryan
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/projects">Projects</Link>
        <Link href="/#experience">Experience</Link>
        <Link href="/#about">About</Link>
        <Link href="/resume" className="resume-link">
          Resume
        </Link>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub <OutArrow size={14} />
        </a>
      </nav>
      <a href={`mailto:${profile.email}`} className="header-contact">
        Let’s talk <OutArrow size={15} />
      </a>
    </header>
  );
}
