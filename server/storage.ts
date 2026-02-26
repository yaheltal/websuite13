import { contactSubmissions, type InsertContact, type ContactSubmission } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  createContact(contact: InsertContact): Promise<ContactSubmission>;
  getContacts(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const [result] = await db.insert(contactSubmissions).values(contact).returning();
    return result;
  }

  async getContacts(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions);
  }
}

export const storage = new DatabaseStorage();
