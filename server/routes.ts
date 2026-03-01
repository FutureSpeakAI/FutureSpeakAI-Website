import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertSignatorySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const existingConfig = await storage.getConfig();
  if (!existingConfig) {
    await storage.createConfig({ title: "My Simple Site" });
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

  return httpServer;
}
