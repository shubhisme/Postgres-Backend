import { db } from "../../lib/db.ts";

export async function getUsers() {
  const response = await db.user.findMany();

  return response;
}

export async function getUserByID(data: { id: string }) {
  const user = await db.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function updateUserNameById(data: { id: string; name: string }) {
  const user = await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}
