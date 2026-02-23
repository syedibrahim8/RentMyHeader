import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { stripe } from "../lib/stripe";
import { User } from "../models/User";
import { AuthedRequest } from "../middleware/auth";
import { Campaign } from "../models/Campaign";
import Stripe from "stripe";
import { env } from "../config/env";

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

    // If already connected, reuse
    if (!user.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
      });

      user.stripeAccountId = account.id;
      await user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId!,
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
  if (req.user?.role !== "brand")
    throw new ApiError(403, "Only brands can pay");

  const { campaignId } = req.params;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new ApiError(404, "Campaign not found");

  if (campaign.brand.toString() !== req.user.id)
    throw new ApiError(403, "Not authorized");

  if (campaign.status !== "influencer_selected")
    throw new ApiError(400, "Campaign not ready for payment");

  // Optional: prevent creating multiple PaymentIntents
  const terminal = new Set(["failed", "canceled", "refunded"]);
  if (campaign.paymentIntentId && !terminal.has(campaign.paymentStatus)) {
    throw new ApiError(400, "Payment already initiated for this campaign");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(campaign.totalAmount * 100),
    currency: campaign.currency ?? "usd",

    capture_method: "manual",

    automatic_payment_methods: { enabled: true },
    metadata: { campaignId: campaign._id.toString() },
    transfer_group: `campaign_${campaign._id.toString()}`,
  });

  campaign.paymentIntentId = paymentIntent.id;
  campaign.paymentStatus = "requires_payment";
  await campaign.save();

  res.json({ clientSecret: paymentIntent.client_secret });
});

// webhook

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig!,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const handleFunded = async (pi: Stripe.PaymentIntent) => {
    const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
    if (!campaign) return;

    // ✅ Authorization successful -> money locked (escrow)
    if (campaign.status !== "funded") {
      campaign.status = "funded";
      campaign.paymentStatus = "requires_capture";
      await campaign.save();
    }
  };

  const handleCaptured = async (pi: Stripe.PaymentIntent) => {
    const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
    if (!campaign) return;

    // ✅ After capture
    campaign.paymentStatus = "captured";
    campaign.capturedAt = new Date();
    await campaign.save();
  };

  const handleFailed = async (pi: Stripe.PaymentIntent) => {
    const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
    if (!campaign) return;

    campaign.paymentStatus = "failed";
    await campaign.save();
  };

  const handleCanceled = async (pi: Stripe.PaymentIntent) => {
    const campaign = await Campaign.findOne({ paymentIntentId: pi.id });
    if (!campaign) return;

    campaign.paymentStatus = "canceled";
    await campaign.save();
  };

  try {
    switch (event.type) {
      case "payment_intent.amount_capturable_updated": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handleFunded(pi);
        break;
      }
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handleCaptured(pi);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handleFailed(pi);
        break;
      }
      case "payment_intent.canceled": {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handleCanceled(pi);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  res.json({ received: true });
};
