import api from "./axios";
import type {
  User,
  Campaign,
  SocialProfile,
  Application,
  CreateCampaignInput,
  CreateSocialProfileInput,
  ApplyInput,
  SubmitProofInput,
  ReviewProofInput,
} from "./types";

// Auth
export const authApi = {
  register: (payload: { name: string; email: string; password: string; role: "brand" | "influencer" }) =>
    api.post("/auth/register", payload).then((r) => r.data),
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>("/auth/login", { email, password }).then((r) => r.data),
  me: () => api.get<User>("/auth/me").then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  forgotPassword: (email: string) => api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (token: string, newPassword: string) =>
    api.post("/auth/reset-password", { token, newPassword }).then((r) => r.data),
  refresh: () => api.post("/auth/refresh").then((r) => r.data),
  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email`, { params: { token } }).then((r) => r.data),
};

// Social Profiles
export const socialApi = {
  create: (payload: CreateSocialProfileInput) => api.post<SocialProfile>("/social", payload).then((r) => r.data),
  me: () => api.get<SocialProfile[]>("/social/me").then((r) => r.data),
  all: () => api.get<SocialProfile[]>("/social").then((r) => r.data),
  delete: (id: string) => api.delete(`/social/${id}`).then((r) => r.data),
};

// Campaigns
export const campaignApi = {
  create: (payload: CreateCampaignInput) => api.post<Campaign>("/campaigns", payload).then((r) => r.data),
  brand: () => api.get<Campaign[]>("/campaigns/brand").then((r) => r.data),
  open: () => api.get<Campaign[]>("/campaigns/open").then((r) => r.data),
  select: (campaignId: string, applicationId: string) =>
    api.post(`/campaigns/${campaignId}/select`, { applicationId }).then((r) => r.data),
};

// Applications
export const applicationApi = {
  apply: (payload: ApplyInput) => api.post<Application>("/applications/apply", payload).then((r) => r.data),
  update: (applicationId: string, payload: { proposedPrice?: number; coverMessage?: string }) =>
    api.patch(`/applications/${applicationId}`, payload).then((r) => r.data),
  me: () => api.get<Application[]>("/applications/me").then((r) => r.data),
  forCampaign: (campaignId: string) =>
    api.get<Application[]>(`/applications/campaign/${campaignId}`).then((r) => r.data),
  submitProof: (applicationId: string, payload: SubmitProofInput) =>
    api.patch(`/applications/${applicationId}/proof`, payload).then((r) => r.data),
  review: (applicationId: string, payload: ReviewProofInput) =>
    api.patch(`/applications/${applicationId}/review`, payload).then((r) => r.data),
};

// Stripe
export const stripeApi = {
  connectOnboard: () => api.post<{ url: string }>("/stripe/connect/onboard").then((r) => r.data),
  payForCampaign: (campaignId: string) =>
    api.post<{ url: string; clientSecret?: string }>(`/stripe/campaigns/${campaignId}/pay`).then((r) => r.data),
};