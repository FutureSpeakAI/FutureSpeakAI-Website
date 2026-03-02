import { pgTable, serial, text, timestamp, integer, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({ id: true });
export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;

export const signatories = pgTable("signatories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organization: text("organization"),
  title: text("title"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});

export const insertSignatorySchema = createInsertSchema(signatories).omit({ id: true, signedAt: true });
export type Signatory = typeof signatories.$inferSelect;
export type InsertSignatory = z.infer<typeof insertSignatorySchema>;

export const certificationInquiries = pgTable("certification_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  githubRepo: text("github_repo").notNull(),
  certificationLevel: text("certification_level").notNull(),
  message: text("message"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCertificationInquirySchema = createInsertSchema(certificationInquiries).omit({ id: true, submittedAt: true });
export type CertificationInquiry = typeof certificationInquiries.$inferSelect;
export type InsertCertificationInquiry = z.infer<typeof insertCertificationInquirySchema>;

export const lineItemSchema = z.object({
  description: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
});

export type LineItem = z.infer<typeof lineItemSchema>;

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientOrganization: text("client_organization"),
  lineItems: jsonb("line_items").notNull().$type<LineItem[]>(),
  subtotal: integer("subtotal").notNull(),
  taxRate: integer("tax_rate").notNull().default(0),
  taxAmount: integer("tax_amount").notNull().default(0),
  total: integer("total").notNull(),
  status: text("status").notNull().default("draft"),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true, createdAt: true, paidAt: true, stripePaymentIntentId: true });
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export const invoiceCounter = pgTable("invoice_counter", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().unique(),
  lastNumber: integer("last_number").notNull().default(0),
});
