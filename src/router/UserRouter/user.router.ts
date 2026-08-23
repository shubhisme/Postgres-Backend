import { createNewUserController } from "../../controller/UserController/addNewUser.ts";
import { Router } from "express";
import { getUserController } from "../../controller/UserController/user.controller.ts";
import { getUserByIdController } from "../../controller/UserController/userbyId.controller.ts";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { requireAuth } from "../../middleware/auth.middlewear.ts";

const router = Router();

router.get("/", requireAuth, asyncHandler(getUserController));
router.post("/", asyncHandler(createNewUserController));
router.get("/:id", requireAuth, asyncHandler(getUserByIdController));

export default router;
