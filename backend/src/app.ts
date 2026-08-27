import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import authRoutes from "./modules/auth/auth.routes";
import tagsRoutes from "./modules/tags/tags.routes";
import eventRoutes from "./modules/events/events.routes";
import rsvpsRoutes from "./modules/rsvps/rsvps.routes";
import { errorHandler } from "./middleware/error.middleware";
import { swaggerSpec } from "./config/swagger";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // allow cookies (to store refresh token)
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
  });
  next();
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Event planning API docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

app.get("/api/docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/events/:eventId/rsvps", rsvpsRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
});

app.use(errorHandler);

export default app;
