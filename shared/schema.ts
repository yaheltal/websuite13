import { sql } from "drizzle-orm";
import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("אנא הזן כתובת אימייל תקינה"),
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  phone: z.string().min(9, "אנא הזן מספר טלפון תקין"),
  message: z.string().min(10, "ההודעה חייבת להכיל לפחות 10 תווים"),
  service: z.string().min(1, "אנא בחר שירות"),
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const onboardingSubmissions = pgTable("onboarding_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service").notNull(),
  questionnaireData: jsonb("questionnaire_data").notNull(),
  chatHistory: jsonb("chat_history"),
  generatedPrompt: text("generated_prompt"),
  uploadedFiles: text("uploaded_files").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOnboardingSchema = createInsertSchema(onboardingSubmissions).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email("אנא הזן כתובת אימייל תקינה"),
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  service: z.string().min(1, "אנא בחר שירות"),
  questionnaireData: z.record(z.any()),
});

export type InsertOnboarding = z.infer<typeof insertOnboardingSchema>;
export type OnboardingSubmission = typeof onboardingSubmissions.$inferSelect;
