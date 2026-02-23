import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createConnectAccount,
  payForCampaign,
} from "../controllers/stripe.controller";

export const stripeRouter = Router();

stripeRouter.post("/connect/onboard", requireAuth, createConnectAccount);
stripeRouter.post("/campaigns/:campaignId/pay", requireAuth, payForCampaign);