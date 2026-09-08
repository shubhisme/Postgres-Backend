import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError.ts";
import { success, ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error({
    method: req.method,
    url: req.originalUrl,
    error,
  });

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.issues,
    });

    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal Serval Error.",
  });
};
