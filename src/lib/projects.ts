import { z } from "zod"; //zod is a lib that validates data, checks every proj has required fields and valid values at runtime
import { repositoryIdPattern } from "./repository-id"; //imports regex that checks repo identifiers like bryan034/food_account_outreach. It expects an owner/repository identifier, rather than a full GitHub URL.

export const projectSchema = z.object({ //defines and exports rules for a proj obj. z.object() means data must be an obj w the fields below
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), //url identifiers
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string(),
  role: z.string(),
  technologies: z.array(z.string()), //lst of strs
  status: z.enum([
    "Independent project",
    "Academic project",
    "Supporting project",
  ]), //must be exactly one of the above
  featured: z.boolean(),
  visible: z.boolean(),
  order: z.number().int(), //z.number() is the type check for js number type. .int() ensures number is an integer (whole number)
  cover: z.union([z.string().startsWith("/"), z.url({ protocol: /^https$/ })]),
  source: z.enum(["curated", "github"]).optional(),
  coverAlt: z.string().min(1),
  coverCaption: z.string().min(1).optional(),
  repository: z.string().regex(repositoryIdPattern).optional(), //optional github repo identifier that must match the imported pattern when supplied
  demoUrl: z.url({ protocol: /^https$/ }).optional(), // chat initially did this: z.string().url().startsWith("https://").optional(), but url() had strike through cause method deprecated 
  contributions: z.array(z.string()),
  contributionConfirmed: z.boolean(),
});
export type Project = z.infer<typeof projectSchema>; //creates ts type Project from schema. TS checks how proj data used while write code, zod checks actual values when .parse() runs
// z.infer keeps ts type aligned with schema wo writing the field definition twice

const records: Project[] = [
  {
    slug: "credit-risk",
    title: "Understanding credit risk",
    summary:
      "From cleaning and classing lending data to weight-of-evidence binning and building a credit scorecard.",
    category: "Machine learning",
    role: "Data preparation & scorecard development",
    technologies: ["WoE binning", "Feature selection", "Credit scorecards"],
    status: "Academic project",
    featured: false,
    visible: true,
    order: 4,
    cover: "/images/credit-score-card.png",
    coverAlt:
      "Conceptual illustration of lending data flowing into model comparison and credit-risk prediction; not a project screenshot.",
    contributions: [
      "Cleaned, categorised, binned, and merged lending data.",
      "Performed correlation analysis, fine and coarse classing, feature selection, and weight-of-evidence binning.",
      "Built the credit scorecard.",
    ],
    contributionConfirmed: true,
  },
  {
    slug: "travel-booking",
    title: "TravelLust",
    summary:
      "Microservice architecture and attraction services to add, book, and plan experiences within a travel platform.",
    category: "Distributed systems",
    role: "Architecture & attraction services",
    technologies: ["Python / Flask", "Docker", "RabbitMQ", "Azure", "Supabase"],
    status: "Academic project",
    featured: false,
    visible: true,
    order: 2,
    cover: "/images/travellust.png",
    coverAlt:
      "Conceptual architecture illustration showing booking, service communication, and RabbitMQ; not a project screenshot.",
    repository: "curryriiiice/IS213-travellust",
    contributions: [
      "Designed the microservice architecture.",
      "Implemented atomic and composite services for adding, booking, and planning attractions.",
    ],
    contributionConfirmed: true,
  },
  {
    slug: "odoo-azure",
    title: "ERP, in the cloud.",
    summary:
      "Configuring and deploying Odoo ERP on Microsoft Azure, with database setup and system maintenance.",
    category: "Cloud & enterprise",
    role: "School project contributor",
    technologies: ["Odoo ERP", "Microsoft Azure", "AKS", "Databases"],
    status: "Supporting project",
    featured: true,
    visible: true,
    order: 3,
    cover: "/images/odoo-azure.svg",
    coverAlt:
      "Conceptual illustration of Odoo ERP, Azure infrastructure, and a connected database; not a project screenshot.",
    contributions: [
      "Configured and deployed an Odoo ERP system on Azure, including VM setup, database configuration, and maintenance, as described in my résumé.",
    ],
    contributionConfirmed: false,
  },
];

export function validateProjects(input: unknown): Project[] { //input: unknown means input structure not trusted yet
  const projects = z.array(projectSchema).parse(input); //checks that input is an array and every item satisfies projectSchema. If validation failes, parse() throws an error, otherwise returns valid data
  if (new Set(projects.map((p) => p.slug)).size !== projects.length) //new Set() keeps unique slugs. p is simply name given to each project while processing it
    throw new Error("Project slugs must be unique");
  return projects;
}
const projects = validateProjects(records);
export function getProjects() {
  return projects.filter((p) => p.visible).sort((a, b) => a.order - b.order);
  // .filter((p) => p.visible) keeps projects whose visible field is true.
  // .sort((a, b) => a.order - b.order) sorts them by increasing order.  
}
export function getFeaturedProjects() {
  return getProjects().filter((p) => p.featured);
}
export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}
