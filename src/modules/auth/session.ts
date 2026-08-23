import crypto from "node:crypto";

export function genetrateSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function hashSessionToken(token : string):string{
    return crypto.createHash('sha256').update(token).digest('hex') 
}