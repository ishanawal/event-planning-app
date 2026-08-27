import { Request, Response, NextFunction } from "express";
import * as rsvpsService from "./rsvps.service";

export async function upsertRsvp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rsvp = await rsvpsService.upsertRsvp(
      Number(req.params.eventId),
      req.user!.userId,
      req.body,
    );

    res.json({
      success: true,
      data: { rsvp },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRsvps(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await rsvpsService.getRsvpsForEvent(
      Number(req.params.eventId),
      req.user?.userId, // optional, will be undefined for unauthenticated requests
    );
    res.json({
      success: true,
      data: result, // { summary, user_rsvp }
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteRsvp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rsvpsService.deleteRsvp(Number(req.params.eventId), req.user!.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
