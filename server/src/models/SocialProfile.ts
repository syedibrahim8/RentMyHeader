import mongoose, { Schema, InferSchemaType } from "mongoose";

const availabilitySchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { _id: false }
);

const pricingSchema = new Schema(
  {
    header: { type: Number, required: true, min: 0 },
    bio: { type: Number, required: true, min: 0 },
    post: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const socialProfileSchema = new Schema(
  {
    influencer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    platform: {
      type: String,
      enum: ["linkedin", "twitter", "facebook"],
      required: true,
    },

    profileUrl: { type: String, required: true },
    followers: { type: Number, required: true, min: 0 },
    niche: { type: String, required: true },

    engagementRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    pricing: pricingSchema,
    availability: [availabilitySchema],

    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Optional unique constraint per influencer per platform
socialProfileSchema.index(
  { influencer: 1, platform: 1 },
  { unique: true }
);

export type SocialProfileDoc = InferSchemaType<typeof socialProfileSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const SocialProfile =
  mongoose.models.SocialProfile ||
  mongoose.model("SocialProfile", socialProfileSchema);