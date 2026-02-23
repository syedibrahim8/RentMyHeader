import type { Campaign, SocialProfile } from "./types";

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp_001",
    assetType: "header",
    requirements: "Crypto-native X header swap for 7 days. Need 100k+ followers and tech audience.",
    startDate: "2026-03-01",
    endDate: "2026-03-08",
    budgetMin: 1500,
    budgetMax: 2500,
    status: "open",
    paymentStatus: "none",
    brandName: "CryptoBase",
    applicationCount: 14,
  },
  {
    id: "cmp_002",
    assetType: "post",
    requirements: "Launch campaign for design tool. Require storytelling thread + pinned post.",
    startDate: "2026-03-04",
    endDate: "2026-03-12",
    budgetMin: 800,
    budgetMax: 1800,
    status: "funded",
    paymentStatus: "succeeded",
    brandName: "Figmaflow",
    applicationCount: 7,
  },
  {
    id: "cmp_003",
    assetType: "bio",
    requirements: "AI SaaS launch — bio link placement for 14 days. SaaS/tech niche preferred.",
    startDate: "2026-03-10",
    endDate: "2026-03-24",
    budgetMin: 500,
    budgetMax: 1200,
    status: "open",
    paymentStatus: "none",
    brandName: "NeuralStack",
    applicationCount: 3,
  },
];

export const mockSocialProfiles: SocialProfile[] = [
  {
    id: "sp_001",
    userId: "user_001",
    platform: "twitter",
    profileUrl: "https://twitter.com/example",
    followers: 125000,
    niche: "Tech & SaaS",
    engagementRate: 4.2,
    pricing: { header: 1800, bio: 900, post: 1200 },
    availability: [{ startDate: "2026-03-01", endDate: "2026-04-30" }],
  },
];
