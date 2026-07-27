import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import path from "path";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import siteSettingsRoutes from "./routes/siteSettingsRoutes";
import noticeRoutes from "./routes/noticeRoutes";
import courseRoutes from "./routes/courseRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import admissionRoutes from "./routes/admissionRoutes";
import contactRoutes from "./routes/contactRoutes";
import facultyRoutes from "./routes/facultyRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import departmentRoutes from "./routes/departmentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";


import { notFound, errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimiters";
import { sanitizeBody } from "./middleware/sanitize";

export const createApp = (): Application => {
  const app = express();

  // --- Security & infra middleware ---
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }, // image haru alag origin (frontend) मा load हुन दिनको लागि
    })
  );
  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(sanitizeBody());
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  }

  app.use("/api", apiLimiter);

  // --- Static file serving (uploaded images/PDFs) ---
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  // --- Health check ---
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- API routes ---
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/notices", noticeRoutes);
  app.use("/api/courses", courseRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/admissions", admissionRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/faculty", facultyRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/settings", siteSettingsRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use(
    "/uploads",
    express.static(path.join(__dirname,"../uploads"))
);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};