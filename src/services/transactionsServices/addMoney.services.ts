import {db} from "../../lib/db.ts";
import {type AddMoneyInput} from "../../validators/TransactionSchema/transactions.validator.ts";

export async function addMoney({id, amount} : AddMoneyInput){

    const addMoney = await db.user.update({
        where:{
            id : id
        },
        data:{
            currentBalance :{
                increment: amount,
            }
        }
    })

    return addMoney;
}