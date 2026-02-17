import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken, JwtRole } from "../utils/jwt";

export type AuthedRequest = Request & { user?: { id: string; role: JwtRole } };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.access_token;
  if (!token) return next(new ApiError(401, "Not authenticated"));

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireRole(...roles: JwtRole[]) {
  return (req: AuthedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Not authenticated"));
    if (!roles.includes(req.user.role)) return next(new ApiError(403, "Forbidden"));
    next();
  };
}