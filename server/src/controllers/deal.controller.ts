import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { AuthedRequest } from "../middleware/auth";
import { Deal } from "../models/Deal";
import { SocialProfile } from "../models/SocialProfile";

const createDealSchema = z.object({
  socialProfileId: z.string(),
  assetType: z.enum(["header", "bio", "post"]),
  startDate: z.string(),
  endDate: z.string(),
});

const PLATFORM_COMMISSION = 0.15;

export const createDeal = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand") {
    throw new ApiError(403, "Only brands can create deals");
  }

  const { socialProfileId, assetType, startDate, endDate } =
    createDealSchema.parse(req.body);

  const profile = await SocialProfile.findById(socialProfileId).populate(
    "influencer"
  );

  if (!profile) {
    throw new ApiError(404, "Social profile not found");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw new ApiError(400, "End date must be after start date");
  }

  // 🔥 Overlap Check
  const overlapping = await Deal.findOne({
    socialProfile: socialProfileId,
    assetType,
    status: { $nin: ["rejected", "cancelled"] },
    startDate: { $lte: end },
    endDate: { $gte: start },
  });

  if (overlapping) {
    throw new ApiError(400, "This asset is already booked for selected dates");
  }

  // 🔥 Auto Pricing
  const durationMs = end.getTime() - start.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  const pricePerDay = profile.pricing[assetType as "header" | "bio" | "post"];

  const totalAmount = durationDays * pricePerDay;
  const commissionAmount = totalAmount * PLATFORM_COMMISSION;
  const influencerAmount = totalAmount - commissionAmount;

  const deal = await Deal.create({
    brand: req.user.id,
    influencer: profile.influencer,
    socialProfile: socialProfileId,
    assetType,
    startDate: start,
    endDate: end,
    totalAmount,
    commissionAmount,
    influencerAmount,
    status: "pending",
  });

  res.status(201).json(deal);
});


// Influencer Accept / Reject

export const respondToDeal = asyncHandler(async (req: AuthedRequest, res) => {
  const { dealId } = req.params;
  const { action } = z
    .object({
      action: z.enum(["accept", "reject"]),
    })
    .parse(req.body);

  const deal = await Deal.findById(dealId);

  if (!deal) throw new ApiError(404, "Deal not found");

  if (deal.influencer.toString() !== req.user?.id) {
    throw new ApiError(403, "Not authorized");
  }

  if (deal.status !== "pending") {
    throw new ApiError(400, "Deal already processed");
  }

  deal.status = action === "accept" ? "accepted" : "rejected";

  await deal.save();

  res.json(deal);
});