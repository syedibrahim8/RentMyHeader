import cron from "node-cron";
import { runAutomationInternal } from "../services/automation.service";

export const startAutomationJob = () => {
  console.log("🕒 Automation job scheduled (every 5 minutes)");

  cron.schedule("*/5 * * * *", async () => {
    console.log("⚙ Running automation job...");

    try {
      const result = await runAutomationInternal();
      console.log("✅ Automation result:", result);
    } catch (error) {
      console.error("❌ Automation error:", error);
    }
  });
};