import {db} from "../../lib/db.ts";
import {type TranferMoneyInput} from  "../../validators/TransactionSchema/transactions.validator.ts"

export async function transferMoney({from_id , to_id , amount} : TranferMoneyInput){
    
    const from_user = await db.user.findUnique({
        where:{
            id : from_id
        }
    })

    const to_user = await db.user.findUnique({
        where:{
            id: to_id
        }
    })

    if(from_user?.currentBalance && from_user.currentBalance < amount){
        console.log("USER BALANCE IS LESS TO SEND...");

        return new Error {`${from_user?.currentBalance} : Less balance . Cannot tranfer ${amount}...`
        }
    }

    const transfer = await db.user.update({
        where : {
            id: from_id
        },
        data:{
            currentBalance : {
                decrement: amount
            }
        }
    })
}