import argon2 from "argon2";
import {
  createSession,
  createUser,
  deleteSessionByTokenHash,
  findUserByEmail,
} from "./auth.repository.ts";
import { RegistartionInput, LoginInput, loginSchema } from "./auth.schema.ts";
import { AppError } from "../../errors/AppError.ts";
import { parse } from "node:querystring";
import { genetrateSessionToken, hashSessionToken } from "./session.ts";

export async function registerUser(input: RegistartionInput) {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new AppError(`User : ${input.email} already exists.`, 401);
  }

  const passHash = await argon2.hash(input.password);

  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash: passHash,
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }
  let passwordValid;
  if (user.passwordHash) {
    passwordValid = await argon2.verify(user?.passwordHash, input.password);
  }

  if (!passwordValid) {
    throw new AppError("Invalid email or password.", 400);
  }

  const sessionToken = genetrateSessionToken();

  const tokenHash = hashSessionToken(sessionToken);

  const expiersAt = new Date();

  expiersAt.setDate(expiersAt.getDate() + 30);

  await createSession({
    userId: user.id,
    tokenHash: tokenHash,
    expiersAt: expiersAt,
  });

  return {
    sessionToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    expiersAt,
  };
}

export async function logoutUser(session: string) {
  const hashToken = hashSessionToken(session);

  await deleteSessionByTokenHash(hashToken);
}
