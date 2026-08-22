import { Request, Response, NextFunction } from "express";
import * as eventsService from "./events.service";
import { success } from "zod";

export async function listEvents(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await eventsService.listEvents(req.query as any);
    res.json({
      succes: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function listUpcomingEvents(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await eventsService.listEvents(req.query as any, "upcoming");
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function listPastEvents(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await eventsService.listEvents(req.query as any, "past");
    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEvent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const event = await eventsService.getEventsById(Number(req.params.id));
    res.json({
      success: true,
      data: { event },
    });
  } catch (err) {
    next(err);
  }
}

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const event = await eventsService.createEvent(req.body, req.user!.userId);
    res.status(201).json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const event = await eventsService.updateEvent(
      Number(req.params.id),
      req.body,
      req.user!.userId,
    );
    res.json({ success: true, data: { event } });
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await eventsService.deleteEvent(Number(req.params.id), req.user!.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
