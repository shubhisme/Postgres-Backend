import { type NextFunction, type Request, type Response } from "express";
import { addNewUser } from "../../services/userServices/addNewUser.services.ts";
import { createUserSchema } from "../../validators/UserSchema/user.validator.ts";

export async function createNewUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = createUserSchema.parse(req.body);

    const user = await addNewUser(data);

    res.status(201).json({ data: user, success: true });
  } catch (err) {
    next(err);
  }
}