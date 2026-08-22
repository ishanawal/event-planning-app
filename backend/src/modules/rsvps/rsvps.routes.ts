import { Router } from "express";
import * as rsvpsController from "./rsps.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { upsertRsvpSchema } from "./rsvps.schema";

const router = Router({ mergeParams: true }); // We need to merge params inorder to access :eventId from parent

router.get("/", rsvpsController.getRsvps);
router.put(
  "/",
  requireAuth,
  validate(upsertRsvpSchema),
  rsvpsController.upsertRsvp,
);
router.delete("/", requireAuth, rsvpsController.deleteRsvp);

export default router;
