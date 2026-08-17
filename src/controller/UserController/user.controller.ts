import {type Request, type Response} from "express";
import { getUsers} from "../../services/userServices/user.services.ts";

export async function getUserController(
    req : Request,
    res : Response
){
    try{
        const users = await getUsers();

        res.status(200).json({data : users});
    }catch(err){
        console.log(err);
    }
}