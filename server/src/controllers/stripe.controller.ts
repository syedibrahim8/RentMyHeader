import Stripe from "stripe";
import { env } from "../config/env";
import { Campaign } from "../models/Campaign";
import { User } from "../models/User";
import { stripe } from "../lib/stripe";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { stripeEscrowIdempotencyKeys } from "../lib/stripeEscrow";

const TERMINAL_PAYMENT_STATUSES = new Set(["failed", "canceled", "refunded"]);

const toStripeAmount = (amount: number) => {
  const stripeAmount = Math.round(amount * 100);
  if (!Number.isFinite(stripeAmount) || stripeAmount <= 0) {
    throw new ApiError(400, "Campaign amount must be greater than zero");
  }

  return stripeAmount;
};


const mapPaymentIntentStatus = (status: Stripe.PaymentIntent.Status) => {
  switch (status) {
    case "requires_capture":
      return "requires_capture";
    case "succeeded":
      return "captured";
    case "canceled":
      return "canceled";
    case "processing":
      return "processing";
    case "requires_payment_method":
    case "requires_confirmation":
    case "requires_action":
      return "requires_payment";
    default:
      return "requires_payment";
  }
};
// ================================
// 1️⃣ Influencer Connect Onboarding
// ================================
export const createConnectAccount = asyncHandler(
  async (req: AuthedRequest, res) => {
    if (req.user?.role !== "influencer") {
      throw new ApiError(403, "Only influencers can connect Stripe");
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
      });

      user.stripeAccountId = account.id;
      await user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${env.APP_BASE_URL}/stripe/refresh`,
      return_url: `${env.APP_BASE_URL}/stripe/success`,
      type: "account_onboarding",
    });

    res.json({ url: accountLink.url });
  },
);

// ================================
// 2️⃣ Brand Creates PaymentIntent (Escrow)
// ================================
export const payForCampaign = asyncHandler(async (req: AuthedRequest, res) => {
  if (req.user?.role !== "brand") {
    throw new ApiError(403, "Only brands can pay");
  }

  const { campaignId } = req.params;
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  if (campaign.brand.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized");
  }

  if (campaign.status !== "influencer_selected") {
    throw new ApiError(400, "Campaign not ready for payment");
  }

  if (!campaign.totalAmount || campaign.totalAmount <= 0) {
    throw new ApiError(400, "Campaign total amount is invalid");
  }

  if (campaign.paymentIntentId && !TERMINAL_PAYMENT_STATUSES.has(campaign.paymentStatus)) {
    const existing = await stripe.paymentIntents.retrieve(campaign.paymentIntentId);

    const mappedStatus = mapPaymentIntentStatus(existing.status);
    if (campaign.paymentStatus !== mappedStatus) {
      campaign.paymentStatus = mappedStatus;
      await campaign.save();
    }

    return res.json({
      paymentIntentId: existing.id,
      clientSecret: existing.client_secret,
      status: existing.status,
      reused: true,
    });
  }

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: toStripeAmount(campaign.totalAmount),
      currency: campaign.currency ?? "usd",
      capture_method: "manual",
      automatic_payment_methods: { enabled: true },
      metadata: {
        campaignId: campaign._id.toString(),
        brandId: campaign.brand.toString(),
        selectedInfluencerId: campaign.selectedInfluencer?.toString() ?? "",
      },
      transfer_group: `campaign_${campaign._id.toString()}`,
    },
    { idempotencyKey: stripeEscrowIdempotencyKeys.paymentIntent(campaign._id.toString()) },
  );

  campaign.paymentIntentId = paymentIntent.id;
  campaign.paymentStatus = mapPaymentIntentStatus(paymentIntent.status);
  await campaign.save();

  return res.json({
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
    reused: false,
  });
});

const setCampaignFunded = async (pi: Stripe.PaymentIntent) => {
  const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
  if (!campaign) return;

  if (campaign.status === "influencer_selected") {
    campaign.status = "funded";
  }

  campaign.paymentStatus = "requires_capture";
  await campaign.save();
};

const setCampaignCaptured = async (pi: Stripe.PaymentIntent) => {
  const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
  if (!campaign) return;

  campaign.paymentStatus = "captured";
  campaign.capturedAt = new Date();
  await campaign.save();
};

const setCampaignFailed = async (pi: Stripe.PaymentIntent) => {
  const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
  if (!campaign) return;

  campaign.paymentStatus = "failed";
  if (campaign.status === "funded") {
    campaign.status = "influencer_selected";
  }

  await campaign.save();
};

const setCampaignCanceled = async (pi: Stripe.PaymentIntent) => {
  const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
  if (!campaign) return;

  campaign.paymentStatus = "canceled";
  if (["funded", "influencer_selected"].includes(campaign.status)) {
    campaign.status = "cancelled";
  }

  await campaign.save();
};

const setCampaignRefunded = async (charge: Stripe.Charge) => {
  if (!charge.payment_intent || typeof charge.payment_intent !== "string") return;

  const campaign = await Campaign.findOne({ paymentIntentId: charge.payment_intent });
  if (!campaign) return;

  campaign.paymentStatus = "refunded";
  campaign.refundedAt = new Date();
  campaign.status = "cancelled";
  await campaign.save();
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  if (!sig) {
    return res.status(400).send("Webhook Error: Missing stripe-signature header");
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.amount_capturable_updated": {
        await setCampaignFunded(event.data.object as Stripe.PaymentIntent);
        break;
      }
      case "payment_intent.succeeded": {
        await setCampaignCaptured(event.data.object as Stripe.PaymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        await setCampaignFailed(event.data.object as Stripe.PaymentIntent);
        break;
      }
      case "payment_intent.canceled": {
        await setCampaignCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      }
      case "charge.refunded": {
        await setCampaignRefunded(event.data.object as Stripe.Charge);
        break;
      }
      default:
        break;
    }
  } catch (_e) {
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  return res.json({ received: true });
};
