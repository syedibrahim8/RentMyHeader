import mongoose, { Schema, InferSchemaType } from "mongoose";

const tokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    kind: { type: String, enum: ["refresh", "verifyEmail", "resetPassword"], required: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type TokenDoc = InferSchemaType<typeof tokenSchema>;
export const Token = mongoose.models.Token || mongoose.model("Token", tokenSchema);