import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createDeal, respondToDeal } from "../controllers/deal.controller";

export const dealRouter = Router();

dealRouter.post("/", requireAuth, createDeal);
dealRouter.patch("/:dealId/respond", requireAuth, respondToDeal);