import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import {
  addMoneyController,
  transferHistoryController,
  transferMoneyController,
} from "./transaction.controller.ts";

const router = Router();

router.post("/add-money", asyncHandler(addMoneyController));
router.post("/transfer", asyncHandler(transferMoneyController));
router.post("/trasfer-history", asyncHandler(transferHistoryController));

export default router;
