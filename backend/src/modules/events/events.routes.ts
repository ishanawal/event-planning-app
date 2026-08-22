import { Router } from "express";

import {
  createEventSchema,
  updateEventSchema,
  eventParamsSchema,
  listEventsSchema,
} from "./events.schema";

import * as eventsController from "./events.controller";
import { validate } from "../../middleware/validate.middleware";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

// Public routes
router.get("/", validate(listEventsSchema), eventsController.listEvents);
router.get(
  "/upcoming",
  validate(listEventsSchema),
  eventsController.listUpcomingEvents,
);
router.get(
  "/past",
  validate(listEventsSchema),
  eventsController.listPastEvents,
);
router.get("/:id", validate(eventParamsSchema), eventsController.getEvent);

// Protected routes
router.post(
  "/",
  requireAuth,
  validate(createEventSchema),
  eventsController.createEvent,
);
router.put(
  "/:id",
  requireAuth,
  validate(updateEventSchema),
  eventsController.updateEvent,
);
router.delete(
  "/:id",
  requireAuth,
  validate(eventParamsSchema),
  eventsController.deleteEvent,
);

export default router;
