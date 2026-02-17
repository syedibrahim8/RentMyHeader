import { Router } from "express";
import {
  createSocialProfile,
  getMyProfiles,
  getAllProfiles,
  deleteProfile,
} from "../controllers/social.controller";
import { requireAuth } from "../middleware/auth";

export const socialRouter = Router();

socialRouter.post("/", requireAuth, createSocialProfile);
socialRouter.get("/me", requireAuth, getMyProfiles);
socialRouter.get("/", getAllProfiles);
socialRouter.delete("/:id", requireAuth, deleteProfile);