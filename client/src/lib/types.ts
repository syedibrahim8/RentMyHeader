export type Role = "brand" | "influencer";

export type CampaignStatus =
  | "open"
  | "influencer_selected"
  | "funded"
  | "active"
  | "completed"
  | "cancelled";

export type ApplicationStatus =
  | "applied"
  | "selected"
  | "rejected"
  | "withdrawn"
  | "proof_submitted"
  | "approved"
  | "failed_proof"
  | "disputed"
  | "released"
  | "refunded";

export type PaymentStatus =
  | "none"
  | "requires_payment"
  | "processing"
  | "succeeded"
  | "refunded"
  | "failed"
  | "requires_capture"
  | "captured"
  | "canceled";

export type AssetType = "header" | "bio" | "post";
export type Platform = "linkedin" | "twitter" | "facebook";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified?: boolean;
}

export interface Campaign {
  id: string;
  brandId?: string;
  brandName?: string;
  assetType: AssetType;
  requirements: string;
  startDate: string;
  endDate: string;
  budgetMin?: number;
  budgetMax?: number;
  status: CampaignStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
  applicationCount?: number;
}

export interface Availability {
  startDate: string;
  endDate: string;
}

export interface Pricing {
  header: number;
  bio: number;
  post: number;
}

export interface SocialProfile {
  id: string;
  userId: string;
  platform: Platform;
  profileUrl: string;
  followers: number;
  niche: string;
  engagementRate: number;
  pricing: Pricing;
  availability: Availability[];
  createdAt?: string;
}

export interface Application {
  id: string;
  campaignId: string;
  socialProfileId: string;
  proposedPrice: number;
  coverMessage?: string;
  status: ApplicationStatus;
  proofUrl?: string;
  proofNotes?: string;
  campaign?: Campaign;
  socialProfile?: SocialProfile;
  influencerName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCampaignInput {
  assetType: AssetType;
  startDate: string;
  endDate: string;
  requirements: string;
  budgetMin?: number;
  budgetMax?: number;
}

export interface CreateSocialProfileInput {
  platform: Platform;
  profileUrl: string;
  followers: number;
  niche: string;
  engagementRate: number;
  pricing: Pricing;
  availability: Availability[];
}

export interface ApplyInput {
  campaignId: string;
  socialProfileId: string;
  proposedPrice: number;
  coverMessage?: string;
}

export interface SubmitProofInput {
  proofUrl: string;
  proofNotes?: string;
}

export interface ReviewProofInput {
  action: "approve" | "reject";
  reason?: string;
}