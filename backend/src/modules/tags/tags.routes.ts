import { Router } from "express";
import * as tagsController from "./tags.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createTagSchema } from "./tags.schema";

const router = Router();

router.get("/", tagsController.getAllTags);
router.get(
  "/",
  requireAuth,
  validate(createTagSchema),
  tagsController.createTag,
);

export default router;
