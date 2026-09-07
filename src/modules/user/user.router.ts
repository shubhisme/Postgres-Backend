import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middlewear.ts";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import {
  getUserByIdController,
  getUsersController,
} from "./user.controller.ts";

const router = Router();

router.get("/", requireAuth, asyncHandler(getUsersController));
router.get("/:id", requireAuth, asyncHandler(getUserByIdController));

export default router;
