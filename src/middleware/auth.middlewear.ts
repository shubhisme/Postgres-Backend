import { Request, Response, NextFunction } from "express";
import { hashSessionToken } from "../modules/auth/session.js";
import { getSession } from "../lib/sessions.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("requireAuth middleware called");
    const sessionToken = req.cookies?.session;

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Authentication required",
        },
      });
    }

    const hashToken = hashSessionToken(sessionToken);
    const session = await getSession(hashToken);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Authentication required",
        },
      });
    }

    const expiresAt = Date.parse(session.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      return res.status(401).json({
        success: false,
        error: {
          code: "SESSION_EXPIRED",
          message: "Session expired",
        },
      });
    }

    console.log("Session is valid, userId:", session.userId);
    req.user = {
      userId: session.userId,
    };

    return next();
  } catch (err) {
    return next(err);
  }
}
