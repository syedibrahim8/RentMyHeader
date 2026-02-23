import { z } from "zod";
import { SocialProfile } from "../models/SocialProfile";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { AuthedRequest } from "../middleware/auth";

const createSchema = z.object({
  platform: z.enum(["linkedin", "twitter", "facebook"]),
  profileUrl: z.string().url(),
  followers: z.coerce.number().min(0),
  niche: z.string().min(2),
  engagementRate: z.coerce.number().min(0).max(100),
  pricing: z.object({
    header: z.coerce.number().min(0),
    bio: z.coerce.number().min(0),
    post: z.coerce.number().min(0),
  }),
});

export const createSocialProfile = asyncHandler(
  async (req: AuthedRequest, res) => {
    if (req.user?.role !== "influencer") {
      throw new ApiError(403, "Only influencers can create profiles");
    }

    const data = createSchema.parse(req.body);

    const profile = await SocialProfile.create({
      influencer: req.user.id,
      ...data,
    });

    res.status(201).json(profile);
  }
);

export const getMyProfiles = asyncHandler(
  async (req: AuthedRequest, res) => {
    const profiles = await SocialProfile.find({
      influencer: req.user?.id,
    });

    res.json(profiles);
  }
);

export const getAllProfiles = asyncHandler(
  async (_req, res) => {
    const profiles = await SocialProfile.find().populate(
      "influencer",
      "name email"
    );

    res.json(profiles);
  }
);

export const deleteProfile = asyncHandler(
  async (req: AuthedRequest, res) => {
    const profile = await SocialProfile.findById(req.params.id);
    if (!profile) throw new ApiError(404, "Profile not found");

    if (profile.influencer.toString() !== req.user?.id) {
      throw new ApiError(403, "Not authorized");
    }

    await profile.deleteOne();
    res.json({ message: "Profile deleted" });
  }
);