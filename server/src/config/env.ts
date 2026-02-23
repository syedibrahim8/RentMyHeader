import { z } from "zod";
import dotenv from "dotenv"
dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),

  CLIENT_ORIGIN: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  ACCESS_TOKEN_EXPIRES_MIN: z.coerce.number().default(15),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(14),

  COOKIE_DOMAIN: z.string().optional().default(""),
  COOKIE_SECURE: z.coerce.boolean().default(false),
  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),

  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1),

  APP_BASE_URL: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(10),
  STRIPE_WEBHOOK_SECRET: z.string().min(10),
  PLATFORM_COMMISSION_RATE: z.coerce.number().min(0).max(1),
});

export const env = envSchema.parse(process.env);
export const isProd = env.NODE_ENV === "production";