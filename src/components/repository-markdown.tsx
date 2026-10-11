import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element, RootContent } from "hast";
import type { Root } from "mdast";
import type { Project } from "@/lib/projects";

const anchors: Record<string, string> = {
  overview: "overview",
  "my contribution & project context": "contribution",
  "technical approach": "technical",
  "further development": "next",
};

// Existing repository articles may still contain the retired Evidence section.
// Remove the whole section, including its subsections, before rendering.
function omitEvidenceSections() {
  return (tree: Root) => {
    let excludedDepth: number | undefined;
    tree.children = tree.children.filter((node) => {
      if (node.type === "heading") {
        if (excludedDepth !== undefined && node.depth <= excludedDepth)
          excludedDepth = undefined;
        const label = node.children
          .map((child) => ("value" in child ? child.value : ""))
          .join("")
          .trim();
        if (/^evidence(?:\s|$)/i.test(label)) excludedDepth = node.depth;
      }
      return excludedDepth === undefined;
    });
  };
}
function text(node: RootContent | Element): string {
  return node.type === "text"
    ? node.value
    : "children" in node
      ? node.children.map(text).join("")
      : "";
}

export function repositoryMarkdownUrl(
  url: string,
  image: boolean,
  repository: string,
  branch: string,
) {
  const safe = defaultUrlTransform(url);
  if (!safe) return "";
  if (safe.startsWith("#")) return safe;
  const root = image
    ? "https://raw.githubusercontent.com"
    : "https://github.com";
  const path = image ? "" : "/blob";
  const resolved = new URL(
    safe,
    `${root}/${repository}${path}/${encodeURIComponent(branch)}/bryans_portfolio/`,
  );
  return resolved.protocol === "https:" &&
    !resolved.username &&
    !resolved.password
    ? resolved.href
    : "";
}

export function RepositoryMarkdown({ project }: { project: Project }) {
  return (
    <Markdown
      skipHtml
      remarkPlugins={[remarkGfm, omitEvidenceSections]}
      urlTransform={(url, key) =>
        repositoryMarkdownUrl(
          url,
          key === "src",
          project.repository!,
          project.repositoryBranch ?? "main",
        )
      }
      components={{
        h2: ({ node, children }) => {
          const heading = node ? text(node).trim().toLowerCase() : "";
          return (
            <h2 id={anchors[heading] ?? heading.replace(/[^a-z0-9]+/g, "-")}>
              {children}
            </h2>
          );
        },
        a: ({ node: _node, ...props }) => (
          <a
            {...props}
            target={props.href?.startsWith("#") ? undefined : "_blank"}
            rel="noreferrer"
          />
        ),
        img: ({ node: _node, ...props }) => (
          <img
            {...props}
            loading="lazy"
            style={{ maxWidth: "100%", height: "auto", borderRadius: 16 }}
          />
        ),
        table: ({ children }) => (
          <div style={{ overflowX: "auto" }}>
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {project.caseStudy}
    </Markdown>
  );
}
