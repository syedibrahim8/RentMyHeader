import mongoose, { Schema, InferSchemaType } from "mongoose";

const campaignSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assetType: {
      type: String,
      enum: ["header", "bio", "post"],
      required: true,
      index: true,
    },

    requirements: { type: String, required: true, minlength: 10 },

    budgetMin: {
      type: Number,
      default: null,
    },

    budgetMax: {
      type: Number,
      default: null,
    },

    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },

    // Auto pricing snapshot (never changes after creation)
    totalAmount: { type: Number, default:null },
    commissionAmount: { type: Number, default:null },
    influencerAmount: { type: Number, default:null },

    // Brand selects one application => selectedInfluencer + selectedApplication
    selectedInfluencer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    selectedApplication: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    selectedAt: { type: Date, default: null },

    status: {
      type: String,
      enum: [
        "open",
        "influencer_selected",
        "funded",
        "active",
        "completed",
        "cancelled",
      ],
      default: "open",
      index: true,
    },

    paymentIntentId: { type: String, default: null, index: true },
    paymentStatus: {
      type: String,
      enum: ["none", "requires_payment", "processing", "succeeded", "refunded", "failed", "requires_capture", "captured", "canceled"],
      default: "none",
      index: true,
    },
    capturedAt: { type: Date, default: null },
    refundId: { type: String, default: null, index: true },
    refundedAt: { type: Date, default: null },

    transferId: { type: String, default: null, index: true },
    paidOutAt: { type: Date, default: null },
    
    currency: { type: String, default: "usd" },
  },
  { timestamps: true },
);

export type CampaignDoc = InferSchemaType<typeof campaignSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
