import { db } from "../../lib/db.ts";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  return db.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

export async function createSession(data: {
  userId: string;
  tokenHash: string;
  expiersAt: Date;
}) {
  return db.session.create({
    data: {
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiersAt: data.expiersAt,
    },
  });
}

export async function findSessionByTokenhash(tokenHash: string) {
  return db.session.findUnique({
    where: {
      tokenHash: tokenHash,
    },
    select: {
      id: true,
      userId: true,
      expiersAt: true,
    },
  });
}

export async function deleteSessionByTokenHash(tokenHash: string) {
  return db.session.deleteMany({
    where: {
      tokenHash: tokenHash,
    },
  });   
}
