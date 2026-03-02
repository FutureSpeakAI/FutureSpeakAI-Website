import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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
