import { redis } from "../../lib/redis.ts";
import {
  getUserByID,
  getUsers,
  updateUserNameById,
} from "./user.repository.ts";

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

export async function updateUserName({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  // Update the user's name in the database
  const updateuser = await updateUserNameById({ id, name });

  redis.del(`user:profile:${id}`); // Invalidate the cache for this user

  return updateuser;
}