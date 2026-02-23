import mongoose from "mongoose";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { AuthedRequest } from "../middleware/auth";
import { Campaign } from "../models/Campaign";
import { Application } from "../models/Application";
import { env } from "../config/env";
import { hasOverlappingCampaign } from "../services/overlap.service";

const PLATFORM_COMMISSION = env.PLATFORM_COMMISSION_RATE;;

const createCampaignSchema = z.object({
  assetType: z.enum(["header", "bio", "post"]),
  startDate: z.string(),
  endDate: z.string(),
  requirements: z.string().min(10),
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
});

export const createCampaign = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand")
    throw new ApiError(403, "Only brands can create campaigns");

  const data = createCampaignSchema.parse(req.body);

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (end <= start)
    throw new ApiError(400, "End date must be after start date");

  const campaign = await Campaign.create({
    brand: req.user.id,
    assetType: data.assetType,
    startDate: start,
    endDate: end,
    requirements: data.requirements,
    budgetMin: data.budgetMin ?? null,
    budgetMax: data.budgetMax ?? null,
  });

  res.status(201).json(campaign);
});

/* ===========================
   GET BRAND CAMPAIGNS
=========================== */

export const getBrandCampaigns = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand")
    throw new ApiError(403, "Only brands");

  const campaigns = await Campaign.find({ brand: req.user.id })
    .sort({ createdAt: -1 });

  res.json(campaigns);
});

/* ===========================
   PUBLIC BROWSE OPEN CAMPAIGNS
=========================== */

export const browseOpenCampaigns = asyncHandler(async (_req, res) => {
  const campaigns = await Campaign.find({ status: "open" })
    .sort({ createdAt: -1 });

  res.json(campaigns);
});

/* ===========================
   SELECT INFLUENCER
=========================== */

const selectSchema = z.object({
  applicationId: z.string(),
});

export const selectInfluencer = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand")
    throw new ApiError(403, "Only brands can select influencer");

  const { campaignId } = req.params;
  const { applicationId } = selectSchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(campaignId))
    throw new ApiError(400, "Invalid campaignId");

  if (!mongoose.Types.ObjectId.isValid(applicationId))
    throw new ApiError(400, "Invalid applicationId");

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  if (campaign.brand.toString() !== req.user.id)
    throw new ApiError(403, "Not authorized");

  if (campaign.status !== "open")
    throw new ApiError(400, "Campaign is not open");

  const app = await Application.findById(applicationId);
  if (!app) throw new ApiError(404, "Application not found");

  if (app.campaign.toString() !== campaignId)
    throw new ApiError(400, "Application does not belong to this campaign");

  if (app.status !== "applied")
    throw new ApiError(400, "Application is not in applied state");

  // ✅ OVERLAP CHECK (source of truth)
  const conflictId = await hasOverlappingCampaign({
    influencerId: String(app.influencer),
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    excludeCampaignId: String(campaign._id),
  });

  if (conflictId) {
    throw new ApiError(
      409,
      `Influencer already booked in an overlapping campaign. Conflict: ${conflictId}`
    );
  }

  // Calculate financials
  const total = app.proposedPrice;
  const commission = total * PLATFORM_COMMISSION;

  // ✅ Small race-condition improvement:
  // update campaign only if still open (prevents double selection)
  const updatedCampaign = await Campaign.findOneAndUpdate(
    { _id: campaignId, status: "open" },
    {
      $set: {
        selectedInfluencer: app.influencer,
        selectedApplication: app._id,
        totalAmount: total,
        commissionAmount: commission,
        influencerAmount: total - commission,
        status: "influencer_selected",
        selectedAt: new Date(),
      },
    },
    { new: true }
  );

  if (!updatedCampaign) {
    throw new ApiError(409, "Campaign already selected by someone else");
  }

  // Update selected app
  app.status = "selected";
  await app.save();

  // Reject others
  await Application.updateMany(
    { campaign: campaignId, _id: { $ne: app._id }, status: "applied" },
    { $set: { status: "rejected" } }
  );

  res.json({ campaign: updatedCampaign, selectedApplication: app });
});