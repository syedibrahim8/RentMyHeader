// import "dotenv/config";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { app } from "./app";
import { startAutomationJob } from "./jobs/automation.job";

async function main() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`✅ Server running on http://localhost:${env.PORT}`);
    startAutomationJob();
  });
}

main().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});