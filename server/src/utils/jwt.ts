import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtRole = "brand" | "influencer" | "admin";

export type AccessPayload = {
  sub: string; // userId
  role: JwtRole;
};

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: `${env.ACCESS_TOKEN_EXPIRES_MIN}m` });
}

export function signRefreshToken(payload: { sub: string }) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: `${env.REFRESH_TOKEN_EXPIRES_DAYS}d` });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; iat: number; exp: number };
}