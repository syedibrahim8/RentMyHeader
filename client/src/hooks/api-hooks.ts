"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { endpoints } from "@/lib/endpoints";

export const useMe = () => useQuery({ queryKey: ["me"], queryFn: async () => (await api.get(endpoints.auth.me)).data.user });
export const useOpenCampaigns = () => useQuery({ queryKey: ["campaigns", "open"], queryFn: async () => (await api.get(endpoints.campaigns.open)).data });
export const useBrandCampaigns = () => useQuery({ queryKey: ["campaigns", "brand"], queryFn: async () => (await api.get(endpoints.campaigns.brand)).data });
export const useMyApplications = () => useQuery({ queryKey: ["applications", "me"], queryFn: async () => (await api.get(endpoints.applications.me)).data });
export const useCampaignApplicationsForBrand = (id: string) => useQuery({ queryKey: ["applications", id], queryFn: async () => (await api.get(endpoints.applications.byCampaign(id))).data, enabled: !!id });
export const useMyProfiles = () => useQuery({ queryKey: ["profiles", "me"], queryFn: async () => (await api.get(endpoints.social.me)).data });
export const useAllProfiles = () => useQuery({ queryKey: ["profiles", "all"], queryFn: async () => (await api.get(endpoints.social.base)).data });

const useApiMutation = <TVariables,>(fn: (payload: TVariables) => Promise<unknown>, keys: string[] = []) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] })),
  });
};

export const useLogin = () => useApiMutation((payload: { email: string; password: string }) => api.post(endpoints.auth.login, payload), ["me"]);
export const useRegister = () => useApiMutation((payload: { name: string; email: string; password: string; role: "brand" | "influencer" }) => api.post(endpoints.auth.register, payload), ["me"]);
export const useLogout = () => useApiMutation(() => api.post(endpoints.auth.logout), ["me"]);
export const useRefresh = () => useApiMutation(() => api.post(endpoints.auth.refresh), ["me"]);
export const useForgotPassword = () => useApiMutation((payload: { email: string }) => api.post(endpoints.auth.forgotPassword, payload));
export const useResetPassword = () => useApiMutation((payload: { token: string | null; newPassword: string }) => api.post(endpoints.auth.resetPassword, payload));
export const useCreateCampaign = () => useApiMutation((payload: { title: string; description: string; budget: number }) => api.post(endpoints.campaigns.base, payload), ["campaigns"]);
export const useSelectInfluencer = () => useApiMutation(({ campaignId, applicationId }: { campaignId: string; applicationId: string }) => api.post(endpoints.campaigns.select(campaignId), { applicationId }), ["campaigns", "applications"]);
export const useApplyToCampaign = () => useApiMutation((payload: { campaignId: string; profileId: string; proposedPrice: number; coverMessage: string }) => api.post(endpoints.applications.apply, payload), ["applications"]);
export const useUpdateApplication = () => useApiMutation(({ applicationId, ...payload }: { applicationId: string; status: string }) => api.patch(endpoints.applications.update(applicationId), payload), ["applications"]);
export const useSubmitProof = () => useApiMutation(({ applicationId, ...payload }: { applicationId: string; proofUrl: string; proofNotes?: string }) => api.patch(endpoints.applications.proof(applicationId), payload), ["applications"]);
export const useReviewProof = () => useApiMutation(({ applicationId, ...payload }: { applicationId: string; action: "approve" | "reject"; reason?: string }) => api.patch(endpoints.applications.review(applicationId), payload), ["applications"]);
export const useCreateProfile = () => useApiMutation((payload: { platform: string; handle: string; followers: number }) => api.post(endpoints.social.base, payload), ["profiles"]);
export const useDeleteProfile = () => useApiMutation((id: string) => api.delete(`${endpoints.social.base}/${id}`), ["profiles"]);
export const useStripeConnectOnboard = () => useApiMutation(() => api.post(endpoints.stripe.onboard));
export const usePayForCampaign = () => useApiMutation((campaignId: string) => api.post(endpoints.stripe.pay(campaignId)), ["campaigns"]);
export const useRunAutomation = () => useApiMutation(() => api.post(endpoints.system.run));
