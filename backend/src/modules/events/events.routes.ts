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
/**
 * @openapi
 * /events:
 *   get:
 *     tags: [Events]
 *     summary: List events with pagination and filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [public, private] }
 *       - in: query
 *         name: tags
 *         description: Comma-separated tag names e.g. "hackathon,networking"
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [event_date, created_at, title], default: event_date }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: asc }
 *     responses:
 *       200:
 *         description: Paginated list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Event' }
 *                 meta: { $ref: '#/components/schemas/PaginationMeta' }
 */
router.get("/", validate(listEventsSchema), eventsController.listEvents);

/**
 * @openapi
 * /events/upcoming:
 *   get:
 *     tags: [Events]
 *     summary: List upcoming events (event_date >= now)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Paginated upcoming events
 */
router.get(
  "/upcoming",
  validate(listEventsSchema),
  eventsController.listUpcomingEvents,
);

/**
 * @openapi
 * /events/past:
 *   get:
 *     tags: [Events]
 *     summary: List past events (event_date < now)
 *     responses:
 *       200:
 *         description: Paginated past events
 */
router.get(
  "/past",
  validate(listEventsSchema),
  eventsController.listPastEvents,
);

/**
 * @openapi
 * /events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get a single event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Event detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     event: { $ref: '#/components/schemas/Event' }
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 */
router.get("/:id", validate(eventParamsSchema), eventsController.getEvent);

// Protected routes
/**
 * @openapi
 * /events:
 *   post:
 *     tags: [Events]
 *     summary: Create a new event
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateEventRequest' }
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     event: { $ref: '#/components/schemas/Event' }
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  requireAuth,
  validate(createEventSchema),
  eventsController.createEvent,
);

/**
 * @openapi
 * /events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Update an event (creator only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateEventRequest' }
 *     responses:
 *       200:
 *         description: Event updated
 *       403:
 *         description: Forbidden — not the creator
 *       404:
 *         description: Event not found
 */
router.put(
  "/:id",
  requireAuth,
  validate(updateEventSchema),
  eventsController.updateEvent,
);

/**
 * @openapi
 * /events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Delete an event (creator only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete(
  "/:id",
  requireAuth,
  validate(eventParamsSchema),
  eventsController.deleteEvent,
);

export default router;
