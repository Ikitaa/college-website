import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";
import { runStartupSeed } from "./utils/seed";

import siteSettingsRoutes from "./routes/siteSettingsRoutes";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await runStartupSeed();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});