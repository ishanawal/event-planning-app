import { Router } from "express";
import * as tagsController from "./tags.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createTagSchema } from "./tags.schema";

const router = Router();

/**
 * @openapi
 * /tags:
 *   get:
 *     tags: [Tags]
 *     summary: List all tags
 *     responses:
 *       200:
 *         description: Array of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Tag' }
 */
router.get("/", tagsController.getAllTags);

/**
 * @openapi
 * /tags:
 *   post:
 *     tags: [Tags]
 *     summary: Create a tag (auth required)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: 'hackathon' }
 *     responses:
 *       201:
 *         description: Tag created
 *       409:
 *         description: Tag already exists
 */
router.get(
  "/",
  requireAuth,
  validate(createTagSchema),
  tagsController.createTag,
);

export default router;
