import { Request, Response, NextFunction } from "express";
import * as tagsService from "./tags.service";

export async function getAllTags(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tags = await tagsService.getAllTags();
    res.json({
      success: true,
      data: { tags },
    });
  } catch (err) {
    next(err);
  }
}

export async function createTag(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tag = await tagsService.createTag(req.body);
    res.status(201).json({
      success: true,
      data: { tag },
    });
  } catch (err) {
    next(err);
  }
}
