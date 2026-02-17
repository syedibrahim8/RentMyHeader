import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: false }, // not required for OAuth users
    role: {
      type: String,
      enum: ["brand", "influencer", "admin"],
      required: true,
    },
    isVerified: { type: Boolean, default: false },

    googleId: { type: String, default: null },
    stripeAccountId: { type: String, default: null }, // Stripe Connect later
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
