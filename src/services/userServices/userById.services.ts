import {db} from "../../lib/db.ts";

export async function getUsersByID({ id }: { id: string }) {
    const user = await db.user.findUnique({
        where: {
            id
        }
    });
    return user;
}