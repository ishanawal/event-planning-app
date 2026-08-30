import { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        name: string;
      };
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token expired or invalid",
      },
    });
  }
}

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  // No authentication supplied.
  // This is allowed because the route is public.
  if (!authHeader) {
    next();
    return;
  }

  // An Authorization header was supplied,
  // so it must contain a valid Bearer token.
  if (!authHeader.startsWith("Bearer ")) {
    _res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid authorization header",
      },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    _res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid authorization token",
      },
    });
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    _res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token expired or invalid",
      },
    });
  }
}
