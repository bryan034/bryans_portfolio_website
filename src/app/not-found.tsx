import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="wrap not-found">
      <p className="eyebrow">404 / A small detour</p>
      <h1>
        This page took
        <br />
        <em>a different path.</em>
      </h1>
      <p>Let’s get you back to the work.</p>
      <Link className="button button-dark" href="/projects">
        Explore projects ↗
      </Link>
    </main>
  );
}
