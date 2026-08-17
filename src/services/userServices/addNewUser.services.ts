import {db} from "../../lib/db.ts";
import {type CreateUserInput} from "../../validators/UserSchema/user.validator.ts";

export async function addNewUser({name  , email , currentBalance } : CreateUserInput){

    const newUser = await db.user.create({
        data:{
            name: name,
            email: email,
            currentBalance: currentBalance
        }
    })

    return newUser;
}