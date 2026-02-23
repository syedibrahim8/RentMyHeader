import { stripe } from "../lib/stripe";
import { stripeEscrowIdempotencyKeys } from "../lib/stripeEscrow";

export const releaseEscrowFunds = async (campaign: any) => {
  if (!campaign?.paymentIntentId) return campaign;

  const campaignId = campaign._id.toString();

  if (campaign.paymentStatus === "requires_capture") {
    try {
      await stripe.paymentIntents.cancel(
        campaign.paymentIntentId,
        {},
        { idempotencyKey: stripeEscrowIdempotencyKeys.cancel(campaignId) },
      );

      campaign.paymentStatus = "canceled";
      campaign.status = "cancelled";
      await campaign.save();
      return campaign;
    } catch (_err) {
      // continue with PI status reconciliation
    }
  }

  const latestPi = await stripe.paymentIntents.retrieve(campaign.paymentIntentId);

  if (latestPi.status === "canceled") {
    campaign.paymentStatus = "canceled";
    campaign.status = "cancelled";
    await campaign.save();
    return campaign;
  }

  if (!["captured", "succeeded"].includes(campaign.paymentStatus) && latestPi.status !== "succeeded") {
    return campaign;
  }

  if (campaign.refundId) {
    return campaign;
  }

  const existingRefunds = await stripe.refunds.list({
    payment_intent: campaign.paymentIntentId,
    limit: 1,
  });

  if (existingRefunds.data.length > 0) {
    campaign.refundId = existingRefunds.data[0].id;
    campaign.refundedAt = new Date();
    campaign.paymentStatus = "refunded";
    campaign.status = "cancelled";
    await campaign.save();
    return campaign;
  }

  const refund = await stripe.refunds.create(
    { payment_intent: campaign.paymentIntentId },
    { idempotencyKey: stripeEscrowIdempotencyKeys.refund(campaignId) },
  );

  campaign.refundId = refund.id;
  campaign.refundedAt = new Date();
  campaign.paymentStatus = "refunded";
  campaign.status = "cancelled";
  await campaign.save();

  return campaign;
};
