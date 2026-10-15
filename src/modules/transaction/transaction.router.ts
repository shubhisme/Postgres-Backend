import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  addMoneyController,
  transferHistoryController,
  transferMoneyController,
} from "./transaction.controller.js";

const router = Router();

router.post("/add-money", asyncHandler(addMoneyController));
router.post("/transfer", asyncHandler(transferMoneyController));
router.post("/trasfer-history", asyncHandler(transferHistoryController));

export default router;
