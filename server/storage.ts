import { contactSubmissions, onboardingSubmissions, type InsertContact, type ContactSubmission, type InsertOnboarding, type OnboardingSubmission } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createContact(contact: InsertContact): Promise<ContactSubmission>;
  getContacts(): Promise<ContactSubmission[]>;
  createOnboarding(data: InsertOnboarding): Promise<OnboardingSubmission>;
  updateOnboarding(id: number, data: Partial<InsertOnboarding>): Promise<OnboardingSubmission>;
  getOnboarding(id: number): Promise<OnboardingSubmission | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const [result] = await db.insert(contactSubmissions).values(contact).returning();
    return result;
  }

  async getContacts(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions);
  }

  async createOnboarding(data: InsertOnboarding): Promise<OnboardingSubmission> {
    const [result] = await db.insert(onboardingSubmissions).values(data).returning();
    return result;
  }

  async updateOnboarding(id: number, data: Partial<InsertOnboarding>): Promise<OnboardingSubmission> {
    const [result] = await db.update(onboardingSubmissions).set(data).where(eq(onboardingSubmissions.id, id)).returning();
    return result;
  }

  async getOnboarding(id: number): Promise<OnboardingSubmission | undefined> {
    const [result] = await db.select().from(onboardingSubmissions).where(eq(onboardingSubmissions.id, id));
    return result;
  }
}

export const storage = new DatabaseStorage();
