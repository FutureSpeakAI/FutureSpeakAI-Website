import { db } from "./db";
import { desc, eq } from "drizzle-orm";
import { siteConfig, signatories, certificationInquiries, type SiteConfig, type InsertSiteConfig, type Signatory, type InsertSignatory, type CertificationInquiry, type InsertCertificationInquiry } from "@shared/schema";

export interface IStorage {
  getConfig(): Promise<SiteConfig | undefined>;
  createConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  getSignatories(): Promise<Signatory[]>;
  getSignatoryCount(): Promise<number>;
  createSignatory(signatory: InsertSignatory): Promise<Signatory>;
  createCertificationInquiry(inquiry: InsertCertificationInquiry): Promise<CertificationInquiry>;
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

  async createCertificationInquiry(inquiry: InsertCertificationInquiry): Promise<CertificationInquiry> {
    const [newInquiry] = await db.insert(certificationInquiries).values(inquiry).returning();
    return newInquiry;
  }
}

export const storage = new DatabaseStorage();
