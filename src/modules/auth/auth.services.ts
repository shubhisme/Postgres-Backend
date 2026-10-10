import argon2 from "argon2";
import { createUser, findUserByEmail } from "./auth.repository.ts";
import { RegistartionInput, LoginInput, loginSchema } from "./auth.schema.ts";
import { AppError } from "../../errors/AppError.ts";
import { genetrateSessionToken, hashSessionToken } from "./session.ts";
import {
  createSession,
  deleteSession,
  getSession,
} from "../../lib/sessions.ts";

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

export async function loginUser(
  input: LoginInput,
  existingSessionToken?: string,
) {
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

  if (existingSessionToken) {
    const existingSession = await getSession(
      hashSessionToken(existingSessionToken),
    );
    const existingExpiresAt = existingSession
      ? Date.parse(existingSession.expiresAt)
      : Number.NaN;

    if (
      existingSession?.userId === user.id &&
      Number.isFinite(existingExpiresAt) &&
      existingExpiresAt > Date.now()
    ) {
      return {
        sessionToken: existingSessionToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        expiresAt: new Date(existingExpiresAt),
      };
    }
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const sessionToken = genetrateSessionToken();
    const tokenHash = hashSessionToken(sessionToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (await createSession(tokenHash, user.id, expiresAt)) {
      return {
        sessionToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        expiresAt,
      };
    }
  }

  throw new AppError("Unable to create a unique login session.", 500);
}

export async function logoutUser(session: string) {
  const hashToken = hashSessionToken(session);

  await deleteSession(hashToken);
}
