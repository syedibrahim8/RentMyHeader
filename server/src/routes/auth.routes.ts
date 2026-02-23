import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { env } from "../config/env";
import { randomToken, sha256 } from "../utils/crypto";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import {
  sendEmail,
  verificationEmailTemplate,
  verificationEmailText,
  resetPasswordTemplate,
  resetPasswordText,
} from "../services/email.service";
import { requireAuth, AuthedRequest } from "../middleware/auth";

export const authRouter = Router();

function setAuthCookies(res: any, access: string, refresh: string) {
  const common = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAMESITE as any,
    domain: env.COOKIE_DOMAIN || undefined,
    path: "/",
  };

  // access token short
  res.cookie("access_token", access, { ...common, maxAge: env.ACCESS_TOKEN_EXPIRES_MIN * 60 * 1000 });

  // refresh token long
  res.cookie("refresh_token", refresh, { ...common, maxAge: env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000 });
}

function clearAuthCookies(res: any) {
  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
}

// Register
authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      name: z.string().min(2).max(120),
      email: z.string().email(),
      password: z.string().min(8).max(72),
      role: z.enum(["brand", "influencer"]),
    });

    const { name, email, password, role } = schema.parse(req.body);

    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already in use");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role, isVerified: false });

    // email verification token
    const raw = randomToken(32);
    const tokenHash = sha256(raw);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Token.create({ userId: user._id, kind: "verifyEmail", tokenHash, expiresAt });

    const link = `${env.APP_BASE_URL}/api/auth/verify-email?token=${raw}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: verificationEmailTemplate(link),
      text: verificationEmailText(link),
    });

    res.status(201).json({ message: "Registered. Please verify your email." });
  })
);

// Verify email
authRouter.get(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const token = String(req.query.token || "");
    if (!token) throw new ApiError(400, "Missing token");

    const tokenHash = sha256(token);
    const doc = await Token.findOne({ kind: "verifyEmail", tokenHash, usedAt: null });
    if (!doc) throw new ApiError(400, "Invalid or expired token");
    if (doc.expiresAt.getTime() < Date.now()) throw new ApiError(400, "Token expired");

    await User.updateOne({ _id: doc.userId }, { $set: { isVerified: true } });
    doc.usedAt = new Date();
    await doc.save();

    // redirect to client page if you want
    res.json({ message: "Email verified successfully." });
  })
);

// Login
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const { email, password } = schema.parse(req.body);

    const user: any = await User.findOne({ email });
    if (!user || !user.passwordHash) throw new ApiError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    if (!user.isVerified) throw new ApiError(403, "Please verify your email first");

    const access = signAccessToken({ sub: String(user._id), role: user.role });
    const refresh = signRefreshToken({ sub: String(user._id) });

    // store refresh token hash in DB
    const refreshHash = sha256(refresh);
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await Token.create({ userId: user._id, kind: "refresh", tokenHash: refreshHash, expiresAt });

    setAuthCookies(res, access, refresh);

    res.json({ message: "Logged in" });
  })
);

// Refresh session (silent)
authRouter.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refresh = req.cookies?.refresh_token;
    if (!refresh) throw new ApiError(401, "Missing refresh token");

    const payload = verifyRefreshToken(refresh);
    const refreshHash = sha256(refresh);

    const doc = await Token.findOne({ kind: "refresh", tokenHash: refreshHash, usedAt: null });
    if (!doc) throw new ApiError(401, "Refresh token revoked");
    if (doc.expiresAt.getTime() < Date.now()) throw new ApiError(401, "Refresh token expired");

    // rotate refresh token (security best practice)
    doc.usedAt = new Date();
    await doc.save();

    const user: any = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, "User not found");

    const newAccess = signAccessToken({ sub: String(user._id), role: user.role });
    const newRefresh = signRefreshToken({ sub: String(user._id) });

    const newRefreshHash = sha256(newRefresh);
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
    await Token.create({ userId: user._id, kind: "refresh", tokenHash: newRefreshHash, expiresAt });

    setAuthCookies(res, newAccess, newRefresh);

    res.json({ message: "Refreshed" });
  })
);

// Me
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = await User.findById(req.user!.id).select("_id name email role isVerified createdAt");
    res.json({ user });
  })
);

// Logout
authRouter.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    clearAuthCookies(res);
    res.json({ message: "Logged out" });
  })
);

// Request password reset
authRouter.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const schema = z.object({ email: z.string().email() });
    const { email } = schema.parse(req.body);

    const user: any = await User.findOne({ email });
    // Do not reveal whether user exists
    if (!user) return res.json({ message: "If the email exists, a reset link will be sent." });

    const raw = randomToken(32);
    const tokenHash = sha256(raw);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    await Token.create({ userId: user._id, kind: "resetPassword", tokenHash, expiresAt });

    const link = `${env.APP_BASE_URL}/api/auth/reset-password?token=${raw}`;
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: resetPasswordTemplate(link),
      text: resetPasswordText(link),
    });

    res.json({ message: "If the email exists, a reset link will be sent." });
  })
);

// Reset password (token + new password)
authRouter.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const schema = z.object({
      token: z.string().min(1),
      newPassword: z.string().min(8).max(72),
    });

    const { token, newPassword } = schema.parse(req.body);

    const tokenHash = sha256(token);
    const doc: any = await Token.findOne({ kind: "resetPassword", tokenHash, usedAt: null });
    if (!doc) throw new ApiError(400, "Invalid or expired token");
    if (doc.expiresAt.getTime() < Date.now()) throw new ApiError(400, "Token expired");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await User.updateOne({ _id: doc.userId }, { $set: { passwordHash } });

    doc.usedAt = new Date();
    await doc.save();

    res.json({ message: "Password reset successful" });
  })
);
