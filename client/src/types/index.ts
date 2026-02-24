export type Role = "brand" | "influencer" | "admin";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
};

export type Campaign = {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
};

export type SocialProfile = {
  _id: string;
  platform: string;
  handle: string;
  followers: number;
  niche?: string;
};

export type Application = {
  _id: string;
  status: string;
  campaignId: string;
  proofUrl?: string;
  proofNotes?: string;
  proposedPrice: number;
  coverMessage?: string;
};
