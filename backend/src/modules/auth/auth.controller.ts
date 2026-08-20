import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      data: { user },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.json({
      success: true,
      data: { user, accessToken },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: {
          code: "NO_TOKEN",
          message: "No refresh token provided",
        },
      });

      return;
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;

    if (refreshToken) await authService.logout(refreshToken);

    res.json({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    });
  } catch (err) {
    next(err);
  }
}
