import { Router } from "express";
import * as rsvpsController from "./rsps.controller";
import { requireAuth, optionalAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upsertRsvpSchema } from "./rsvps.schema";

const router = Router({ mergeParams: true }); // We need to merge params inorder to access :eventId from parent

/**
 * @openapi
 * /events/{eventId}/rsvps:
 *   get:
 *     tags: [RSVPs]
 *     summary: Get RSVP summary for an event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: RSVP counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     summary: { $ref: '#/components/schemas/RsvpSummary' }
 */
router.get("/", optionalAuth, rsvpsController.getRsvps);

/**
 * @openapi
 * /events/{eventId}/rsvps:
 *   put:
 *     tags: [RSVPs]
 *     summary: Create or update your RSVP for an event
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [yes, no, maybe] }
 *     responses:
 *       200:
 *         description: RSVP upserted
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  requireAuth,
  validate(upsertRsvpSchema),
  rsvpsController.upsertRsvp,
);

/**
 * @openapi
 * /events/{eventId}/rsvps:
 *   delete:
 *     tags: [RSVPs]
 *     summary: Remove your RSVP
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: RSVP removed
 */
router.delete("/", requireAuth, rsvpsController.deleteRsvp);

export default router;
