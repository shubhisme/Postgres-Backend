import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "./auth.controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.middlewear.js";

const router = Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));
router.post("/logout", requireAuth, asyncHandler(logoutController));

export default router;
