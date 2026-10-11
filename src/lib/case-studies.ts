import "server-only";
import CreditRisk from "@/content/projects/credit-risk.mdx";
import TravelBooking from "@/content/projects/travel-booking.mdx";
import OdooAzure from "@/content/projects/odoo-azure.mdx";
// import mdx file as a component names xxx

export const caseStudies = {
  "credit-risk": CreditRisk,
  "travel-booking": TravelBooking,
  "odoo-azure": OdooAzure,
};
export function getCaseStudy(slug: string) {
  return Object.hasOwn(caseStudies, slug)
    ? caseStudies[slug as keyof typeof caseStudies]
    : undefined;
}
// helper function to retrieve specific caseStudies object from collection
// caseStudies[...] looks up a value inside pre-existing dictionary caseStudies
// slug as keyof typeof caseStudies: ensures slug str passed in matches 1 of the actual keys inside caseStudies
