import { Router } from "express";
import { addMoneyController } from "../../controller/TransactionController/addMoney.controller.ts";
import { transferMoneyController } from "../../controller/TransactionController/transferMoney.controller.ts";
import { transferHistoryController } from "../../controller/TransactionController/transferHistory.controller.ts";

const router = Router();

router.post("/add-money", addMoneyController);
router.post("/transfer", transferMoneyController);
router.post("/trasfer-history", transferHistoryController);

export default router;