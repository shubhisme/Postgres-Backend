import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middlewear.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  getUserByIdController,
  getUsersController,
  updateUserNameController,
} from "./user.controller.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(getUsersController));
router.get("/:id", requireAuth, asyncHandler(getUserByIdController));
router.patch("/:id", requireAuth, asyncHandler(updateUserNameController));

export default router;
