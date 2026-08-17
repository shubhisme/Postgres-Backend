import { Router } from "express";
import { addMoneyController } from "../../controller/TransactionController/addMoney.controller.ts";

const router = Router();

router.post("/" , addMoneyController);
router.post("/" , transferMoneyController)

export default router;