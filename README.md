# Bryan Chang — personal portfolio

A local-first portfolio for AI, applied AI, and software engineering internship applications. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and local MDX case studies. The palette is cream `#F6F1E0`, sage `#B2BA9C`, warm brown `#956840`, and dark brown `#482414`.

## Run locally

Use Node.js 24 (the container uses the same major version).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. No database, account, API key, or Docker installation is needed for the site to work.

```sh
npm test
npm run typecheck
npm run build
npm start
```

Browser checks use Playwright. Install its Chromium browser once with `npx playwright install chromium`, then run `npm run test:e2e`. To use an existing Chrome installation instead:

```sh
PLAYWRIGHT_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run test:e2e
```

## Why containerize this project?

Docker provides a repeatable Linux runtime for checking the production build and for future self-hosting. It also demonstrates a deployment practice already relevant to the travel-booking project. For a small portfolio it is optional: native development is faster and has fewer moving parts, and Vercel can build this Next.js source directly without the image.

The multi-stage Dockerfile installs dependencies with the committed lockfile, builds the site, and copies only Next.js's standalone runtime and public assets into the final image. The runtime runs as an unprivileged user and includes an HTTP health check. Environment files, build outputs, and local dependencies are excluded from the build context. GitHub credentials are passed at runtime rather than baked into the image.

Production-like local preview:

```sh
docker compose up --build -d portfolio
docker compose ps
# http://127.0.0.1:3000
docker compose down
```

Optional container development, with live edits on a separate port:

```sh
docker compose --profile dev up --build development
# http://127.0.0.1:3001
```

The development service mounts source and keeps Linux dependencies and Next.js state in dedicated volumes. If dependency inputs change, reset only its volumes with `docker compose --profile dev down --volumes` and rebuild. This removes container dependency/build caches, not source files.

No public deployment has been configured. A container running on your computer is a local preview, not a hosted portfolio. No separate backend or database service is required.

## How the site works

1. `src/lib/projects.ts` validates curated project records. `src/lib/project-catalog.ts` merges them with public GitHub repositories owned by `bryan034` and tagged `portfolio`, deduplicating curated repository entries.
2. Home, Projects, Resume, and detail routes load this server-side catalog. Curated records retain their order; discovered repositories follow in alphabetical order and are featured on the homepage.
3. `src/lib/case-studies.ts` maps curated slugs to trusted local MDX. Discovered projects read their JSON metadata and Markdown article from `bryans_portfolio`; a basic React detail page is used when the article is absent. Remote MDX is never executed.
4. GitHub repository lists are paginated and cached for one hour, with five-second request timeouts. Authored JSON and Markdown files are fetched without caching in development (refresh the page after a push), and cached for one hour in production. Revalidation is request-driven, not a background schedule. New dynamic project routes are permitted after the production build, so new tagged repositories do not require rebuilding the website.
5. GitHub failures leave curated projects available. Missing or broken covers use a themed placeholder.
6. Screenshot enlargement and resume printing are the interactive components; experience uses native disclosures.

## Add a GitHub project automatically

1. Publish a public repository under `bryan034` (forks are excluded).
2. Add the `portfolio` topic in the repository's About settings.
3. Add `bryans_portfolio/cover.png` at the repository root and push it to the default branch. The spelling and case must match exactly.
4. Add `bryans_portfolio/portfolio.json` with `version: 1` and optional fields: title, summary, category, role, technologies, status, featured, visible, order, coverAlt, coverCaption, contributions, contributionConfirmed, demoUrl (HTTPS or null). Valid fields override GitHub defaults; invalid fields fall back independently.
5. Add `bryans_portfolio/case-study.md` for the article. Plain Markdown, lists, links, images, and tables are supported; raw HTML and executable MDX are not. Relative links resolve within this folder on GitHub, and the standard four section headings receive sidebar anchors.
6. The project appears after the next cache refresh. Removing the topic removes it after refresh. No local project record or MDX import is necessary.

Discovered URLs include the repository ID to prevent collisions between similarly named repositories. These pages display repository-authored content, with GitHub metadata as fallback. The former manual Foodfolio and fault-report records and MDX imports have been removed.

For curated work without a repository, or work owned by another account, continue editing `src/lib/projects.ts` and its MDX file. Add new local case-study imports in `src/lib/case-studies.ts`.

An optional server-only `GITHUB_TOKEN` raises API limits. Native development reads `.env.local`; Compose reads a shell variable or `.env`. Never use a `NEXT_PUBLIC_` token. The portfolio requires no database.

Profile and experience text live in `src/lib/profile.ts`. Design tokens and responsive styles live in `src/app/globals.css`. A plain sans-serif resume at `/resume` can be printed or saved as a PDF. The original résumé is not copied into public assets because it contains a phone number.

## Content review before public release

The content sources are the supplied résumé, Bryan's confirmed ownership details, and the public project documentation and code. Discovered GitHub projects display repository-supplied summaries. Foodfolio's own tests and live provider integrations were not run during this portfolio update. TravelLust describes microservice architecture and attraction-service ownership. Credit-risk describes data preparation, classing, WoE binning, feature selection, and scorecard construction. The meal-planning website is excluded at Bryan's request. The site does not claim independent ownership of group projects, invented performance numbers, current live deployments, or access to confidential employer work. The case-study narratives disclose where project-specific evidence has not yet been provided.

Before publishing, confirm:

- Synapxe's current role wording and dates, GPA and academic distinctions, and which professional achievements may be shared.
- Odoo responsibilities and any additional team context; then set `contributionConfirmed: true` for that record.
- The selected public repositories, order, original screenshots, test evidence, technical trade-offs, and verified outcomes.
- Hosting account, domain, and production release workflow. Development review comes first.

## Own the implementation

Trace one request: open `/projects/travel-booking`, find its slug in the registry, follow `getProject`, inspect the selected MDX component, and then inspect the optional GitHub fetch. Explain why an API failure cannot remove the project narrative.

Try three small changes: reorder a project, add a captioned screenshot, and simulate a GitHub rate limit in the tests. For Docker, explain what each build stage contains, why port 3000 must be published, why the runtime user is unprivileged, and why a running image is different from a public deployment.

A technical task is fully done when the site works and you can explain, trace, debug, or modify the part you changed.

## Compiler and formatting

Production builds use Next.js’s supported Webpack compiler because the local sandbox blocked Turbopack’s temporary worker ports. Development uses the standard Next.js dev server. The production build has been verified natively and inside Docker. The Compose development service has also been smoke-tested. Run `npm run format` to keep the source readable and consistent.

## Visual design

The design takes inspiration from Revolut’s bold sans-serif typography and simple controls while retaining Bryan’s cream, sage, warm-brown, and dark-brown palette. Inter is self-hosted through `@fontsource-variable/inter`; no proprietary Revolut font is included. The supplied portrait lives at `public/images/bryan-chang.jpg` and is displayed in a circular CSS frame at the left of the hero. To adjust the crop, change `.hero-portrait img` in `src/app/globals.css`. The original photo file is preserved. GitHub is linked in the hero, navigation, contact section, and resume.
