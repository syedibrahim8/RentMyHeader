import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createCampaign,
  getBrandCampaigns,
  browseOpenCampaigns,
  selectInfluencer,
} from "../controllers/campaign.controller";

export const campaignRouter = Router();

campaignRouter.post("/", requireAuth, createCampaign);
campaignRouter.get("/brand", requireAuth, getBrandCampaigns);
campaignRouter.get("/open", browseOpenCampaigns);

// brand selects one influencer (by applicationId)
campaignRouter.post("/:campaignId/select", requireAuth, selectInfluencer);