import { Router } from "express";
import { addMoneyController } from "../../controller/TransactionController/addMoney.controller.ts";
import { transferMoneyController } from "../../controller/TransactionController/transferMoney.controller.ts";
import { transferHistoryController } from "../../controller/TransactionController/transferHistory.controller.ts";
import { asyncHandler } from "../../middleware/asyncHandler.ts";

const router = Router();

router.post("/add-money", asyncHandler(addMoneyController));
router.post("/transfer", asyncHandler(transferMoneyController));
router.post("/trasfer-history", asyncHandler(transferHistoryController));

export default router;
