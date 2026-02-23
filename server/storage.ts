import { db } from "./db";
import { siteConfig, type SiteConfig, type InsertSiteConfig } from "@shared/schema";

export interface IStorage {
  getConfig(): Promise<SiteConfig | undefined>;
  createConfig(config: InsertSiteConfig): Promise<SiteConfig>;
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
}

export const storage = new DatabaseStorage();
