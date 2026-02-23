import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { runAutomation } from "../controllers/system.controller";

export const systemRouter = Router();

// Only admin should run this manually
systemRouter.post("/run", requireAuth, runAutomation);