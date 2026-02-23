import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  applyToCampaign,
  updateApplication,
  getMyApplications,
  getCampaignApplicationsForBrand,
  submitProof, 
  reviewProof
} from "../controllers/application.controller";

export const applicationRouter = Router();

applicationRouter.post("/apply", requireAuth, applyToCampaign);
applicationRouter.patch("/:applicationId", requireAuth, updateApplication);
applicationRouter.get("/me", requireAuth, getMyApplications);

// brand views applications per campaign
applicationRouter.get("/campaign/:campaignId", requireAuth, getCampaignApplicationsForBrand);

applicationRouter.patch("/:applicationId/proof", requireAuth, submitProof);
applicationRouter.patch("/:applicationId/review", requireAuth, reviewProof);