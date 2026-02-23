import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup minimal initial data
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

  return httpServer;
}
