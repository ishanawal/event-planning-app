import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, signupSchema } from "./auth_schema";
import * as authController from "./auth.controller";
const router = Router();

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
