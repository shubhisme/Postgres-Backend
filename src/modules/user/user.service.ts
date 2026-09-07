import { redis } from "../../lib/redis.ts";
import { getUserByID, getUsers } from "./user.repository.ts";
import { getUserByIdSchema } from "./user.validator.ts";

export async function getUsersService() {
  const users = await getUsers();

  return users;
}

export async function getUsersByID({ id }: { id: string }) {
  const cacheKey = `user:profile:${id}`;

  // check redis
  const cachedUser = await redis.get(cacheKey);

  //cacahe HIT
  if (cachedUser) {
    console.log("Cache HIT : ", cachedUser);
    return JSON.parse(cachedUser);
  }

  const user = await getUserByID({ id });

  console.log("Cache MISS : ", cacheKey);

  // store in redis
  await redis.set(cacheKey, JSON.stringify(user), { EX: 300 });

  return user;
}
