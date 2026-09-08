import { type Request, type Response, type NextFunction } from "express";
import {
  registrationSchema,
  RegistartionInput,
  loginSchema,
} from "./auth.schema.ts";
import { loginUser, logoutUser, registerUser } from "./auth.services.ts";
import { AppError } from "../../errors/AppError.ts";
import { success } from "zod";

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const input = registrationSchema.parse(req.body);

  const user = await registerUser(input);

  if (!user) {
    throw new AppError("No user created.", 401);
  }

  return res.status(201).json({
    success: true,
    data: { user },
  });
}

export async function loginController(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);

  const result = await loginUser(input);

  res.cookie("session", result.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: result.expiersAt,
    path: "/",
  });

  return res.status(200).json({
    success: true,
    data: {
      user: result.user,
    },
  });
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = req.cookies.session;

    if (session) {
      await logoutUser(session);
    }

    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    });
  } catch (err) {
    next(err);
  }
}
