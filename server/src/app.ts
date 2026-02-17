import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import { env } from "./config/env";
import { authLimiter } from "./middleware/rateLimit";
import { authRouter } from "./routes/auth.routes";
import { notFound, errorHandler } from "./middleware/error";
import { socialRouter } from "./routes/social.routes";

export const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use("/api/social", socialRouter);

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  })
);

// rate limit only auth routes
app.use("/api/auth", authLimiter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);

app.use(notFound);
app.use(errorHandler);