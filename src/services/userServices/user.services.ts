import { db } from "../../lib/db.ts";

export async function getUsers() {
  const users = await db.user.findMany();

  return users;
}
