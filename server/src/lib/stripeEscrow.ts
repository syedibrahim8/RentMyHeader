export const stripeEscrowIdempotencyKeys = {
  paymentIntent: (campaignId: string) => `escrow_pi_${campaignId}`,
  capture: (campaignId: string) => `escrow_capture_${campaignId}`,
  cancel: (campaignId: string) => `escrow_cancel_${campaignId}`,
  refund: (campaignId: string) => `escrow_refund_${campaignId}`,
  transfer: (campaignId: string) => `escrow_transfer_${campaignId}`,
};
