import {type Request, type Response} from "express";
import { getUsersByID } from "../../services/userServices/userById.services.ts";
import {getUserByIdSchema} from "../../validators/UserSchema/user.validator.ts";

export async function getUserByIdController(
    req : Request,
    res : Response
){
    try{
        const data = getUserByIdSchema.parse(req.params);
        const users = await getUsersByID(data);

        res.status(200).json({data : users});
    }catch(err){
        console.log(err);
    }
}