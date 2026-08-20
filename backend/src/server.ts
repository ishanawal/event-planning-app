import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import db from "./config/database";
import logger from "./utils/logger";

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  try {
    await db.raw("SELECT 1");
    logger.info("Database connection established");

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", {
      error: (err as Error).message,
    });
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");
  await db.destroy();
  process.exit(0);
});

start();
