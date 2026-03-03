import { describe, it, expect } from "vitest";
import { generateReplitPrompt, generateCursorPrompt } from "./email";

describe("email prompts (Replit / Cursor)", () => {
  const baseData = {
    clientName: "Test Client",
    service: "landing-page",
    questionnaireData: {
      businessName: "Flower Shop",
      businessField: "מכירת פרחים",
      targetAudience: "חתונות ואירועים",
      mainGoal: "לידים והזמנות",
      brandColors: "#ff69b4, #2d2d2d",
    },
    chatSummary: "Client wants a simple one-pager with contact form.",
  };

  it("generateReplitPrompt returns English-only prompt", () => {
    const prompt = generateReplitPrompt(baseData);
    expect(prompt).toContain("Build a Landing page for \"Test Client\"");
    expect(prompt).toContain("Project requirements (relevant for building");
    expect(prompt).toContain("Technical guidelines:");
    expect(prompt).toContain("RTL support");
    expect(prompt).toContain("Colors:");
    expect(prompt).toContain("Business name: Flower Shop");
    expect(prompt).toContain("Field / Industry: ");
    expect(prompt).toContain("Target audience: ");
    expect(prompt).toContain("Main goal ");
    expect(prompt).toContain("Brand colors: ");
    expect(prompt).toContain("Client conversation summary");
    expect(prompt).toContain("Client wants a simple one-pager");
    // No Hebrew structure/labels in prompt (values may be Hebrew)
    expect(prompt).not.toMatch(/שם העסק|תחום פעילות|קהל יעד|מטרה עיקרית|צבעי מותג/);
  });

  it("generateCursorPrompt returns English-only prompt", () => {
    const prompt = generateCursorPrompt(baseData);
    expect(prompt).toContain("In this Cursor project, build a Landing page for client \"Test Client\"");
    expect(prompt).toContain("Project requirements (relevant for building");
    expect(prompt).toContain("Instructions:");
    expect(prompt).toContain("Use the existing project structure");
    expect(prompt).toContain("Business name: Flower Shop");
    expect(prompt).toContain("Brand/colors:");
    expect(prompt).toContain(".cursor/rules");
    expect(prompt).not.toMatch(/שם העסק|תחום פעילות|פרומפט/);
  });

  it("Replit prompt uses fallback when no requirements", () => {
    const prompt = generateReplitPrompt({
      clientName: "Minimal",
      service: "digital-card",
      questionnaireData: {},
    });
    expect(prompt).toContain("No specific requirements provided");
    expect(prompt).toContain("Digital business card");
    expect(prompt).toContain("professional choice");
  });

  it("Cursor prompt includes chat summary when provided", () => {
    const prompt = generateCursorPrompt({
      ...baseData,
      chatSummary: "Summary in English only.",
    });
    expect(prompt).toContain("Client conversation summary");
    expect(prompt).toContain("Summary in English only.");
  });

  it("Replit and Cursor prompts exclude budget and timeline", () => {
    const withBudget = {
      clientName: "C",
      service: "landing-page",
      questionnaireData: {
        businessName: "Test",
        budget: "5000",
        timeline: "2 weeks",
        "תקציב משוער": "5000",
        "לוח זמנים רצוי": "חודש",
      },
    };
    const replit = generateReplitPrompt(withBudget);
    const cursor = generateCursorPrompt(withBudget);
    expect(replit).not.toMatch(/5000|2 weeks|חודש/);
    expect(cursor).not.toMatch(/5000|2 weeks|חודש/);
    expect(replit).toContain("Business name: Test");
    expect(cursor).toContain("Business name: Test");
  });

  it("unknown questionnaire keys get title-cased English label", () => {
    const prompt = generateReplitPrompt({
      clientName: "C",
      service: "other",
      questionnaireData: { customField: "value" },
    });
    expect(prompt).toContain("Custom Field: value");
  });
});

describe("onboarding email content (prompts embedded)", () => {
  it("Replit and Cursor prompts are in English and embedded in typical HTML", () => {
    const replit = generateReplitPrompt({
      clientName: "Onboard Client",
      service: "ecommerce",
      questionnaireData: { businessName: "Shop", productCount: "50" },
      chatSummary: "Wants 50 products.",
    });
    const cursor = generateCursorPrompt({
      clientName: "Onboard Client",
      service: "ecommerce",
      questionnaireData: { businessName: "Shop", productCount: "50" },
      chatSummary: "Wants 50 products.",
    });
    expect(replit).toContain("Build a ");
    expect(replit).toContain("Business name: Shop");
    expect(replit).toContain("Approximate number of products: 50");
    expect(cursor).toContain("In this Cursor project");
    expect(cursor).toContain("Business name: Shop");
    expect(cursor).toContain("Approximate number of products: 50");
    expect(cursor).toContain("Client conversation summary");
    // No Hebrew labels in prompt body
    expect(replit).not.toMatch(/שם העסק|כמה מוצרים|תקציב|לוח זמנים/);
    expect(cursor).not.toMatch(/שם העסק|כמה מוצרים|תקציב|לוח זמנים/);
  });
});
