import {type Request , type Response} from "express";
import { getUserByIdSchema } from "./user.validator.ts";
import { getUsersByID } from "./user.service.ts";
import { AppError } from "../../errors/AppError.ts";
import { getUsers } from "./user.repository.ts";

export async function getUserByIdController(req: Request , res: Response){
    const data = getUserByIdSchema.parse(req.params);

    const users = await getUsersByID(data);

    if (!users) {
        throw new AppError(`No user found with this ID : ${data.id}`, 404);
    }

    res.status(200).json({ data: users });
}

export async function getUsersController(req: Request, res: Response) {
  const users = await getUsers();

  if (!users) {
    throw new AppError("Users not found.", 404);
  }

  res.status(200).json({ data: users });
}