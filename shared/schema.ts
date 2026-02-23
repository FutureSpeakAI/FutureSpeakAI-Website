import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).omit({ id: true });
export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
