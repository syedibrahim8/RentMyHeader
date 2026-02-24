export const endpoints = {
  health: "/api/health",
  auth: {
    register: "/api/auth/register",
    verifyEmail: "/api/auth/verify-email",
    login: "/api/auth/login",
    refresh: "/api/auth/refresh",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
  },
  social: {
    base: "/api/social",
    me: "/api/social/me",
  },
  campaigns: {
    base: "/api/campaigns",
    brand: "/api/campaigns/brand",
    open: "/api/campaigns/open",
    select: (campaignId: string) => `/api/campaigns/${campaignId}/select`,
  },
  applications: {
    apply: "/api/applications/apply",
    update: (id: string) => `/api/applications/${id}`,
    me: "/api/applications/me",
    byCampaign: (id: string) => `/api/applications/campaign/${id}`,
    proof: (id: string) => `/api/applications/${id}/proof`,
    review: (id: string) => `/api/applications/${id}/review`,
  },
  stripe: {
    onboard: "/api/stripe/connect/onboard",
    pay: (campaignId: string) => `/api/stripe/campaigns/${campaignId}/pay`,
  },
  system: {
    run: "/api/system/run",
  },
};
