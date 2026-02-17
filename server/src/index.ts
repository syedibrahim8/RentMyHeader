import "dotenv/config";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { app } from "./app";

async function main() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`✅ API running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});