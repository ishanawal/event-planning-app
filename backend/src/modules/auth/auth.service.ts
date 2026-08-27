import bcrypt from "bcrypt";
import db from "../../config/database";
import { AppError } from "../../utils/errors";
import { LoginBody, SignupBody } from "./auth_schema";
import logger from "../../utils/logger";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

const SALT_ROUNDS = 12;

interface DbUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

function sanitizeUser(user: DbUser) {
  const { password, ...safe } = user;
  return safe;
}

export async function signup(data: SignupBody) {
  const existing = await db("users")
    .where({ email: data.email })
    .first<DbUser>();

  if (existing) {
    throw new AppError("Email already in use", 409, "EMAIL_IN_USE");
  }

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const [user] = await db("users")
    .insert({ name: data.name, email: data.email, password: hashed })
    .returning("*");

  logger.info("User registered", { userId: user.id });

  return sanitizeUser(user as DbUser);
}

export async function login(data: LoginBody) {
  const user = await db("users").where({ email: data.email }).first<DbUser>();

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }

  const payload = { userId: user.id, email: user.email, name: user.name };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db("refresh_tokens").insert({
    user_id: user.id,
    token: refreshToken,
    expires_at: expiresAt,
  });

  logger.info("User logged in", { userId: user.id });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401, "INVALID_TOKEN");
  }

  const stored = await db("refresh_tokens")
    .where({ token: refreshToken })
    .where("expires_at", ">", new Date())
    .first();

  if (!stored) {
    throw new AppError(
      "Refresh token revoked or expired",
      401,
      "TOKEN_REVOKED",
    );
  }

  const newAccessToken = signAccessToken({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
  });

  return { accessToken: newAccessToken };
}

export async function logout(refreshToken: string) {
  await db("refresh_tokens").where({ token: refreshToken }).delete();
}
