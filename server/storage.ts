import { db } from "./db";
import { desc } from "drizzle-orm";
import { siteConfig, signatories, type SiteConfig, type InsertSiteConfig, type Signatory, type InsertSignatory } from "@shared/schema";

export interface IStorage {
  getConfig(): Promise<SiteConfig | undefined>;
  createConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  getSignatories(): Promise<Signatory[]>;
  getSignatoryCount(): Promise<number>;
  createSignatory(signatory: InsertSignatory): Promise<Signatory>;
}

export class DatabaseStorage implements IStorage {
  async getConfig(): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(siteConfig).limit(1);
    return config;
  }

  async createConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const [newConfig] = await db.insert(siteConfig).values(config).returning();
    return newConfig;
  }

  async getSignatories(): Promise<Signatory[]> {
    return db.select().from(signatories).orderBy(desc(signatories.signedAt));
  }

  async getSignatoryCount(): Promise<number> {
    const rows = await db.select().from(signatories);
    return rows.length;
  }

  async createSignatory(signatory: InsertSignatory): Promise<Signatory> {
    const [newSignatory] = await db.insert(signatories).values(signatory).returning();
    return newSignatory;
  }
}

export const storage = new DatabaseStorage();
