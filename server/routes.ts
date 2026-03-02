import type { Express, Request, Response, NextFunction } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertSignatorySchema, insertCertificationInquirySchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const existingConfig = await storage.getConfig();
  if (!existingConfig) {
    await storage.createConfig({ title: "FutureSpeak.AI" });
  }

  app.get(api.config.get.path, async (req, res) => {
    const config = await storage.getConfig();
    if (!config) {
      return res.status(404).json({ message: "Config not found" });
    }
    res.json(config);
  });

  app.get("/api/signatories", async (req, res) => {
    const allSignatories = await storage.getSignatories();
    const count = allSignatories.length;
    res.json({ signatories: allSignatories, count });
  });

  app.post("/api/signatories", async (req, res) => {
    const parsed = insertSignatorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors });
    }
    const signatory = await storage.createSignatory(parsed.data);
    res.status(201).json(signatory);
  });

  app.post("/api/certification-inquiry", async (req, res) => {
    const parsed = insertCertificationInquirySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten().fieldErrors });
    }

    const inquiry = await storage.createCertificationInquiry(parsed.data);

    try {
      const { client, fromEmail } = await getUncachableResendClient();
      await client.emails.send({
        from: fromEmail || "onboarding@resend.dev",
        to: "stephencwebster@gmail.com",
        subject: `Certification Inquiry: ${parsed.data.certificationLevel} — ${parsed.data.name}`,
        html: `
          <h2>New Asimov Agent Certification Inquiry</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Name</td><td style="padding:6px 12px;">${parsed.data.name}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Email</td><td style="padding:6px 12px;"><a href="mailto:${parsed.data.email}">${parsed.data.email}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Organization</td><td style="padding:6px 12px;">${parsed.data.organization || '—'}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">GitHub Repo</td><td style="padding:6px 12px;"><a href="${parsed.data.githubRepo}">${parsed.data.githubRepo}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Level</td><td style="padding:6px 12px;">${parsed.data.certificationLevel}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;color:#555;">Message</td><td style="padding:6px 12px;">${parsed.data.message || '—'}</td></tr>
          </table>
          <p style="margin-top:16px;color:#888;font-size:12px;">Submitted ${new Date().toISOString()}</p>
        `
      });
    } catch (emailErr) {
      console.error("Failed to send certification inquiry email:", emailErr);
    }

    res.status(201).json({ success: true, id: inquiry.id });
  });

  return httpServer;
}
