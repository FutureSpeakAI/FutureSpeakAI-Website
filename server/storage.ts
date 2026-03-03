import { db } from "./db";
import { desc, eq, sql } from "drizzle-orm";
import { siteConfig, signatories, certificationInquiries, invoices, invoiceCounter, emailSubscribers, type SiteConfig, type InsertSiteConfig, type Signatory, type InsertSignatory, type CertificationInquiry, type InsertCertificationInquiry, type Invoice, type InsertInvoice, type EmailSubscriber, type InsertEmailSubscriber } from "@shared/schema";

export interface IStorage {
  getConfig(): Promise<SiteConfig | undefined>;
  createConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  getSignatories(): Promise<Signatory[]>;
  getSignatoryCount(): Promise<number>;
  createSignatory(signatory: InsertSignatory): Promise<Signatory>;
  createCertificationInquiry(inquiry: InsertCertificationInquiry): Promise<CertificationInquiry>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined>;
  listInvoices(): Promise<Invoice[]>;
  updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined>;
  updateInvoicePaidAt(id: number, paidAt: Date, stripePaymentIntentId: string): Promise<Invoice | undefined>;
  updateInvoiceStripePaymentIntent(id: number, stripePaymentIntentId: string): Promise<Invoice | undefined>;
  getNextInvoiceNumber(): Promise<string>;
  createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber>;
  listEmailSubscribers(): Promise<EmailSubscriber[]>;
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

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.invoiceNumber, invoiceNumber));
    return invoice;
  }

  async listInvoices(): Promise<Invoice[]> {
    return db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async updateInvoiceStatus(id: number, status: string): Promise<Invoice | undefined> {
    const [updated] = await db.update(invoices).set({ status }).where(eq(invoices.id, id)).returning();
    return updated;
  }

  async updateInvoicePaidAt(id: number, paidAt: Date, stripePaymentIntentId: string): Promise<Invoice | undefined> {
    const [updated] = await db.update(invoices).set({ status: "paid", paidAt, stripePaymentIntentId }).where(eq(invoices.id, id)).returning();
    return updated;
  }

  async updateInvoiceStripePaymentIntent(id: number, stripePaymentIntentId: string): Promise<Invoice | undefined> {
    const [updated] = await db.update(invoices).set({ stripePaymentIntentId }).where(eq(invoices.id, id)).returning();
    return updated;
  }

  async getNextInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const existing = await db.select().from(invoiceCounter).where(eq(invoiceCounter.year, currentYear));

    let nextNum: number;
    if (existing.length === 0) {
      await db.insert(invoiceCounter).values({ year: currentYear, lastNumber: 1 });
      nextNum = 1;
    } else {
      nextNum = existing[0].lastNumber + 1;
      await db.update(invoiceCounter).set({ lastNumber: nextNum }).where(eq(invoiceCounter.year, currentYear));
    }

    return `FS-${currentYear}-${String(nextNum).padStart(3, '0')}`;
  }

  async createEmailSubscriber(subscriber: InsertEmailSubscriber): Promise<EmailSubscriber> {
    const [newSubscriber] = await db.insert(emailSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async listEmailSubscribers(): Promise<EmailSubscriber[]> {
    return db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.subscribedAt));
  }
}

export const storage = new DatabaseStorage();
