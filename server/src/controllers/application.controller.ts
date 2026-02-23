import mongoose from "mongoose";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { AuthedRequest } from "../middleware/auth";
import { Campaign } from "../models/Campaign";
import { Application } from "../models/Application";
import { SocialProfile } from "../models/SocialProfile";
import { stripe } from "../lib/stripe";
import { stripeEscrowIdempotencyKeys } from "../lib/stripeEscrow";
import { releaseEscrowFunds } from "../services/escrow.service";

const applySchema = z.object({
  campaignId: z.string(),
  socialProfileId: z.string(),
  proposedPrice: z.number().min(1),
  coverMessage: z.string().optional(),
});
export const applyToCampaign = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "influencer")
    throw new ApiError(403, "Only influencers can apply");

  const { campaignId, socialProfileId, proposedPrice, coverMessage } =
    applySchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(campaignId))
    throw new ApiError(400, "Invalid campaignId");

  if (!mongoose.Types.ObjectId.isValid(socialProfileId))
    throw new ApiError(400, "Invalid socialProfileId");

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  if (campaign.status !== "open")
    throw new ApiError(400, "Campaign is not open for applications");

  const profile = await SocialProfile.findById(socialProfileId);
  if (!profile) throw new ApiError(404, "Social profile not found");

  if (profile.influencer.toString() !== req.user.id)
    throw new ApiError(403, "Profile does not belong to you");

  // Prevent duplicate applications
  const existing = await Application.findOne({
    campaign: campaignId,
    influencer: req.user.id,
  });

  if (existing) throw new ApiError(400, "You already applied to this campaign");

  // Create application (unique index prevents duplicates)
  const application = await Application.create({
    campaign: campaignId,
    influencer: req.user.id,
    socialProfile: socialProfileId,
    proposedPrice,
    coverMessage: coverMessage ?? "",
  });

  res.status(201).json(application);
});

const updateSchema = z.object({
  proposedPrice: z.number().min(1).optional(),
  coverMessage: z.string().optional(),
});

export const updateApplication = asyncHandler(
  async (req: AuthedRequest, res) => {
    if (req.user?.role !== "influencer")
      throw new ApiError(403, "Only influencers");

    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId))
      throw new ApiError(400, "Invalid applicationId");

    const application = await Application.findById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    if (application.influencer.toString() !== req.user.id)
      throw new ApiError(403, "Not authorized");

    if (application.status !== "applied")
      throw new ApiError(400, "Cannot edit after selection");

    const data = updateSchema.parse(req.body);

    if (data.proposedPrice !== undefined)
      application.proposedPrice = data.proposedPrice;

    if (data.coverMessage !== undefined)
      application.coverMessage = data.coverMessage;

    await application.save();

    res.json(application);
  },
);

export const getMyApplications = asyncHandler(
  async (req: AuthedRequest, res) => {
    if (req.user?.role !== "influencer")
      throw new ApiError(403, "Only influencers");

    const apps = await Application.find({ influencer: req.user.id })
      .populate("campaign")
      .sort({ createdAt: -1 });

    res.json(apps);
  },
);

export const getCampaignApplicationsForBrand = asyncHandler(
  async (req: AuthedRequest, res) => {
    if (req.user?.role !== "brand") throw new ApiError(403, "Only brands");

    const { campaignId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(campaignId))
      throw new ApiError(400, "Invalid campaignId");

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new ApiError(404, "Campaign not found");

    if (campaign.brand.toString() !== req.user.id)
      throw new ApiError(403, "Not authorized");

    const applications = await Application.find({ campaign: campaignId })
      .populate("influencer", "name email")
      .populate("socialProfile")
      .sort({ createdAt: -1 });

    res.json(applications);
  },
);

const proofSchema = z.object({
  proofUrl: z.string().trim().url(),
  proofNotes: z.string().trim().max(1000).optional(),
});

export const submitProof = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "influencer")
    throw new ApiError(403, "Only influencers can submit proof");

  const { applicationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(applicationId))
    throw new ApiError(400, "Invalid applicationId");

  const { proofUrl, proofNotes } = proofSchema.parse(req.body);

  const application =
    await Application.findById(applicationId).populate("campaign");
  if (!application) throw new ApiError(404, "Application not found");

  if (application.influencer.toString() !== req.user.id)
    throw new ApiError(403, "Not authorized");

  if (application.status !== "selected")
    throw new ApiError(400, "Application is not selected");

  if (application.proofSubmittedAt)
    throw new ApiError(400, "Proof already submitted");

  const campaign = application.campaign as any;

  if (campaign.status !== "active")
    throw new ApiError(400, "Campaign is not active");

  if (application.proofDueAt && new Date() > application.proofDueAt)
    throw new ApiError(400, "Proof submission window expired");

  const now = new Date();

  application.proofUrl = proofUrl;
  application.proofNotes = proofNotes ?? null;
  application.proofSubmittedAt = now;
  application.reviewDueAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  application.status = "proof_submitted";

  await application.save();

  res.json(application);
});

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().optional(),
});

export const reviewProof = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand")
    throw new ApiError(403, "Only brands can review proof");

  const { applicationId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(applicationId))
    throw new ApiError(400, "Invalid applicationId");

  const { action, reason } = reviewSchema.parse(req.body);

  const application: any =
    await Application.findById(applicationId).populate("campaign");
  if (!application) throw new ApiError(404, "Application not found");

  const campaign: any = application.campaign;

  if (campaign.brand.toString() !== req.user.id)
    throw new ApiError(403, "Not authorized");

  if (application.status !== "proof_submitted")
    throw new ApiError(400, "Proof not submitted yet");

  if (application.reviewDueAt && new Date() > application.reviewDueAt)
    throw new ApiError(400, "Review window expired");

  // ✅ must be funded for escrow
  if (
    !campaign.paymentIntentId ||
    !["requires_capture", "captured", "succeeded"].includes(campaign.paymentStatus)
  ) {
    throw new ApiError(400, "Campaign is not funded for escrow yet");
  }

  if (action === "approve") {
    const now = new Date();

    // 1) mark approved
    application.status = "approved";
    application.approvedAt = now;
    await application.save();

    // 2) capture escrow (idempotent)
    // If already captured, Stripe will error; so we guard by paymentStatus
    if (campaign.paymentStatus === "requires_capture") {
      await stripe.paymentIntents.capture(
        campaign.paymentIntentId,
        {},
        { idempotencyKey: stripeEscrowIdempotencyKeys.capture(campaign._id.toString()) },
      );

      campaign.paymentStatus = "captured";
      campaign.capturedAt = now;
      await campaign.save();
    }

    return res.json({ application, campaign });
  }

  // reject -> dispute + release brand funds
  application.status = "disputed";
  application.rejectedReason = reason ?? "Proof rejected";
  await application.save();

  if (campaign.paymentIntentId) {
    await releaseEscrowFunds(campaign);
  }

  return res.json({ application, campaign });
});
