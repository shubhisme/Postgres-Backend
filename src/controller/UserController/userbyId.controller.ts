import { type Request, type Response } from "express";
import { getUsersByID } from "../../services/userServices/userById.services.ts";
import { getUserByIdSchema } from "../../validators/UserSchema/user.validator.ts";
import { AppError } from "../../errors/AppError.ts";

export async function getUserByIdController(req: Request, res: Response) {
  const data = getUserByIdSchema.parse(req.params);

  const users = await getUsersByID(data);

  if (!users) {
    throw new AppError(`No user found with this ID : ${data.id}`, 404);
  }

  res.status(200).json({ data: users });
}