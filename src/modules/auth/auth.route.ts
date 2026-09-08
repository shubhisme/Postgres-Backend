import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller.ts";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { requireAuth } from "../../middleware/auth.middlewear.ts";

const router = Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.post("/logout", requireAuth, asyncHandler(logoutController));

export default router;
