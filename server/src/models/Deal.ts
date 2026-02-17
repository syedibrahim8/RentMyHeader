import mongoose, { Schema, InferSchemaType } from "mongoose";

const dealSchema = new Schema(
  {
    brand: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    influencer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    socialProfile: {
      type: Schema.Types.ObjectId,
      ref: "SocialProfile",
      required: true,
    },

    assetType: {
      type: String,
      enum: ["header", "bio", "post"],
      required: true,
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    totalAmount: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    influencerAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "funded",
        "active",
        "completed",
        "released",
        "cancelled",
        "disputed"
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type DealDoc = InferSchemaType<typeof dealSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Deal =
  mongoose.models.Deal || mongoose.model("Deal", dealSchema);