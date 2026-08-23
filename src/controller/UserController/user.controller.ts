import { type Request, type Response } from "express";
import { getUsers } from "../../services/userServices/user.services.ts";
import { AppError } from "../../errors/AppError.ts";

export async function getUserController(req: Request, res: Response) {
  const users = await getUsers();

  if (!users) {
    throw new AppError("Users not found.", 404);
  }

  res.status(200).json({ data: users });
}