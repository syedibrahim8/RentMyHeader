import { Campaign } from "../models/Campaign";
import { Application } from "../models/Application";
import { User } from "../models/User";
import { stripe } from "../lib/stripe";
import { stripeEscrowIdempotencyKeys } from "../lib/stripeEscrow";
import { releaseEscrowFunds } from "./escrow.service";

export const runAutomationInternal = async () => {
  const now = new Date();

  /* =====================================================
     1️⃣ Activate Campaigns (funded → active)
  ===================================================== */
  const campaignsToActivate = await Campaign.find({
    status: "funded",
    startDate: { $lte: now },
  });

  for (const campaign of campaignsToActivate) {
    campaign.status = "active";
    await campaign.save();

    if (campaign.selectedApplication) {
      await Application.updateOne(
        { _id: campaign.selectedApplication },
        {
          $set: {
            proofDueAt: new Date(campaign.startDate.getTime() + 24 * 60 * 60 * 1000),
          },
        }
      );
    }
  }

  /* =====================================================
     2️⃣ Auto-fail Proof + Cancel/Refund (IDEMPOTENT)
  ===================================================== */
  const expiredProofApps = await Application.find({
    status: "selected",
    proofDueAt: { $lte: now },
    proofSubmittedAt: null,
  });

  for (const app of expiredProofApps) {
    const campaign = await Campaign.findById(app.campaign);
    if (!campaign) continue;

    if (campaign.paymentIntentId) {
      await releaseEscrowFunds(campaign);
    }

    // Mark failed_proof so it won't be reprocessed
    if (app.status !== "failed_proof") {
      app.status = "failed_proof";
      await app.save();
    }
  }

  /* =====================================================
     3️⃣ Auto-approve Expired Reviews
  ===================================================== */
  const expiredReviews = await Application.find({
    status: "proof_submitted",
    reviewDueAt: { $lte: now },
  });

  for (const app of expiredReviews) {
    if (app.status !== "approved") {
      app.status = "approved";
      app.approvedAt = now;
      await app.save();
    }
  }

  /* =====================================================
     4️⃣ Release Funds (Transfer) — IDEMPOTENT
  ===================================================== */
  const releasableCampaigns = await Campaign.find({
    status: "active",
    endDate: { $lte: now },
    transferId: null,
  });

  let transferredCount = 0;

  for (const campaign of releasableCampaigns) {
    const app = await Application.findById(campaign.selectedApplication);
    if (!app || app.status !== "approved") continue;

    const influencer = await User.findById(app.influencer);
    if (!influencer?.stripeAccountId) continue;

    // ✅ Only transfer if captured (capture happens at approval for long campaigns)
    if (!["captured", "succeeded"].includes(campaign.paymentStatus)) continue;

    const transfer = await stripe.transfers.create(
      {
        amount: Math.round(campaign.influencerAmount * 100),
        currency: campaign.currency ?? "usd",
        destination: influencer.stripeAccountId,
        metadata: {
          campaignId: campaign._id.toString(),
          applicationId: app._id.toString(),
        },
      },
      { idempotencyKey: stripeEscrowIdempotencyKeys.transfer(campaign._id.toString()) }
    );

    campaign.transferId = transfer.id;
    campaign.paidOutAt = now;
    campaign.status = "completed";
    await campaign.save();

    if (app.status !== "released") {
      app.status = "released";
      await app.save();
    }

    transferredCount++;
  }

  // ✅ Now cron/system will log a real result object
  return {
    activated: campaignsToActivate.length,
    failedProof: expiredProofApps.length,
    autoApproved: expiredReviews.length,
    transferred: transferredCount,
  };
};