import mongoose from "mongoose";
import { Campaign } from "../models/Campaign";

export async function hasOverlappingCampaign(params: {
  influencerId: string;
  startDate: Date;
  endDate: Date;
  excludeCampaignId?: string;
}) {
  const { influencerId, startDate, endDate, excludeCampaignId } = params;

  const filter: any = {
    selectedInfluencer: new mongoose.Types.ObjectId(influencerId),
    status: { $in: ["influencer_selected", "funded", "active"] },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeCampaignId && mongoose.Types.ObjectId.isValid(excludeCampaignId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(excludeCampaignId) };
  }

  const conflict = await Campaign.findOne(filter).select("_id").lean();
  return conflict ? String(conflict._id) : null;
}