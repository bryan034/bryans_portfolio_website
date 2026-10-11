import { describe, expect, it } from "vitest";
import {
  getProjects,
  getFeaturedProjects,
  getProject,
  validateProjects,
} from "../src/lib/projects";
describe("curated content", () => {
  it("preserves editorial order and limits featured projects", () => {
    expect(getProjects().map((p) => p.slug)).toEqual([
      "travel-booking",
      "odoo-azure",
      "credit-risk",
    ]);
    expect(getFeaturedProjects()).toHaveLength(1);
  });
  it("does not resolve unknown or prototype property slugs", () => {
    expect(getProject("missing")).toBeUndefined();
    expect(getProject("toString")).toBeUndefined();
    expect(getProject("meal-planning")).toBeUndefined();
  });
  it("rejects duplicates and invalid routes before they reach pages", () => {
    const project = getProjects()[0];
    expect(() => validateProjects([project, project])).toThrow("unique");
    expect(() =>
      validateProjects([{ ...project, slug: "../private" }]),
    ).toThrow();
  });
});
