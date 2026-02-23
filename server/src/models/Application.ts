import mongoose, { Schema, InferSchemaType } from "mongoose";

const applicationSchema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true, index: true },
    influencer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },


    socialProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SocialProfile",
      required: true,
    },

    proposedPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "applied",
        "selected",
        "rejected",
        "withdrawn",
        "proof_submitted",
        "approved",
        "failed_proof",
        "disputed",
        "released",
        "refunded",
      ],
      default: "applied",
      index: true,
    },

    // Proof + deadlines (only relevant once selected / active)
    proofUrl: { type: String, default: null },
    proofNotes: { type: String, default: null },
    proofSubmittedAt: { type: Date, default: null },

    proofDueAt: { type: Date, default: null },    // startDate + 24h
    reviewDueAt: { type: Date, default: null },   // proofSubmittedAt + 24h
    approvedAt: { type: Date, default: null },

    rejectedReason: { type: String, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate applications (same influencer cannot apply twice to same campaign)
applicationSchema.index({ campaign: 1, influencer: 1 }, { unique: true });

export type ApplicationDoc = InferSchemaType<typeof applicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema);
