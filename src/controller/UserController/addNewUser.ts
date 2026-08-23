import { type NextFunction, type Request, type Response } from "express";
import { addNewUser } from "../../services/userServices/addNewUser.services.ts";
import { createUserSchema } from "../../validators/UserSchema/user.validator.ts";
import { AppError } from "../../errors/AppError.ts";

export async function createNewUserController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const data = createUserSchema.parse(req.body);

  const user = await addNewUser(data);

  if (!user) {
    throw new AppError("Failed to create User.", 400);
  }

  res.status(201).json({ data: user, success: true });
}
