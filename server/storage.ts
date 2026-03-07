import { type InsertContact, type ContactSubmission, type InsertOnboarding, type OnboardingSubmission, type AdminUser, type InsertAdminUser } from "@shared/schema";

export interface IStorage {
  createContact(contact: InsertContact): Promise<ContactSubmission>;
  getContacts(): Promise<ContactSubmission[]>;
  createOnboarding(data: InsertOnboarding): Promise<OnboardingSubmission>;
  updateOnboarding(id: number, data: Partial<InsertOnboarding>): Promise<OnboardingSubmission>;
  getOnboarding(id: number): Promise<OnboardingSubmission | undefined>;
  getOnboardings(): Promise<OnboardingSubmission[]>;
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminById(id: number): Promise<AdminUser | undefined>;
  createAdmin(data: InsertAdminUser): Promise<AdminUser>;
  updateAdminPassword(id: number, hashedPassword: string): Promise<void>;
}

class MemoryStorage implements IStorage {
  private contacts: ContactSubmission[] = [];
  private onboardings: OnboardingSubmission[] = [];
  private admins: AdminUser[] = [];
  private nextContactId = 1;
  private nextOnboardingId = 1;
  private nextAdminId = 1;

  async createContact(contact: InsertContact): Promise<ContactSubmission> {
    const entry: ContactSubmission = {
      id: this.nextContactId++,
      name: contact.name,
      email: contact.email,
      phone: contact.phone ?? null,
      service: contact.service,
      message: contact.message,
      createdAt: new Date(),
    };
    this.contacts.push(entry);
    return entry;
  }

  async getContacts(): Promise<ContactSubmission[]> {
    return this.contacts;
  }

  async createOnboarding(data: InsertOnboarding): Promise<OnboardingSubmission> {
    const entry: OnboardingSubmission = {
      id: this.nextOnboardingId++,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      service: data.service,
      questionnaireData: data.questionnaireData,
      chatHistory: data.chatHistory ?? null,
      generatedPrompt: data.generatedPrompt ?? null,
      uploadedFiles: data.uploadedFiles ?? null,
      createdAt: new Date(),
    };
    this.onboardings.push(entry);
    return entry;
  }

  async updateOnboarding(id: number, data: Partial<InsertOnboarding>): Promise<OnboardingSubmission> {
    const idx = this.onboardings.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error(`Onboarding ${id} not found`);
    Object.assign(this.onboardings[idx], data);
    return this.onboardings[idx];
  }

  async getOnboarding(id: number): Promise<OnboardingSubmission | undefined> {
    return this.onboardings.find((o) => o.id === id);
  }

  async getOnboardings(): Promise<OnboardingSubmission[]> {
    return this.onboardings;
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    return this.admins.find((a) => a.username === username);
  }

  async getAdminById(id: number): Promise<AdminUser | undefined> {
    return this.admins.find((a) => a.id === id);
  }

  async createAdmin(data: InsertAdminUser): Promise<AdminUser> {
    const entry: AdminUser = {
      id: this.nextAdminId++,
      username: data.username,
      password: data.password,
      createdAt: new Date(),
    };
    this.admins.push(entry);
    return entry;
  }

  async updateAdminPassword(id: number, hashedPassword: string): Promise<void> {
    const admin = this.admins.find((a) => a.id === id);
    if (admin) admin.password = hashedPassword;
  }
}

function createStorage(): IStorage {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require("./db");
    const schema = require("@shared/schema");
    const { eq } = require("drizzle-orm");

    const dbStorage: IStorage = {
      async createContact(contact: InsertContact) {
        const [result] = await db.insert(schema.contactSubmissions).values(contact).returning();
        return result;
      },
      async getContacts() {
        return db.select().from(schema.contactSubmissions);
      },
      async createOnboarding(data: InsertOnboarding) {
        const [result] = await db.insert(schema.onboardingSubmissions).values(data).returning();
        return result;
      },
      async updateOnboarding(id: number, data: Partial<InsertOnboarding>) {
        const [result] = await db.update(schema.onboardingSubmissions).set(data).where(eq(schema.onboardingSubmissions.id, id)).returning();
        return result;
      },
      async getOnboarding(id: number) {
        const [result] = await db.select().from(schema.onboardingSubmissions).where(eq(schema.onboardingSubmissions.id, id));
        return result;
      },
      async getOnboardings() {
        return db.select().from(schema.onboardingSubmissions);
      },
      async getAdminByUsername(username: string) {
        const [result] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.username, username));
        return result;
      },
      async getAdminById(id: number) {
        const [result] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id));
        return result;
      },
      async createAdmin(data: InsertAdminUser) {
        const [result] = await db.insert(schema.adminUsers).values(data).returning();
        return result;
      },
      async updateAdminPassword(id: number, hashedPassword: string) {
        await db.update(schema.adminUsers).set({ password: hashedPassword }).where(eq(schema.adminUsers.id, id));
      },
    };
    console.log("Using PostgreSQL storage");
    return dbStorage;
  } catch {
    console.log("PostgreSQL unavailable — using in-memory storage");
    return new MemoryStorage();
  }
}

export const storage = createStorage();
