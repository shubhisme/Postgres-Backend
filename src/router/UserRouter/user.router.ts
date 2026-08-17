import { createNewUserController } from "../../controller/UserController/addNewUser.ts";
import { Router } from "express";
import { getUserController } from "../../controller/UserController/user.controller.ts";
import { getUserByIdController } from "../../controller/UserController/userbyId.controller.ts";

const router = Router();

router.get("/", getUserController);
router.post("/", createNewUserController);
router.post("/:id", getUserByIdController);

export default router;