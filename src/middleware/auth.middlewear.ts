import { Request, Response, NextFunction } from "express";
import { hashSessionToken } from "../modules/auth/session.ts";
import { findSessionByTokenhash } from "../modules/auth/auth.repository.ts";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    console.log("requireAuth reached");
    console.log("cookies:", req.cookies);
    console.log("authorization:", req.headers.authorization);
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

    console.log({ hashtoken: hashToken });

    const session = await findSessionByTokenhash(hashToken);

    console.log(session);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Authentication required",
        },
      });
    }

    if (session.expiersAt <= new Date()) {
      return res.status(401).json({
        success: false,
        error: {
          code: "SESSION_EXPIRED",
          message: "Session expired",
        },
      });
    }

    req.user = {
      userId: session.userId,
    };
    console.log("req.user:", req.user);

    console.log("calling next()");

    return next();
  } catch (err) {
    return next(err);
  }
}
