import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get(
  "/stats",
  protect,
  authorize("admin"),
  asyncHandler(getDashboardStats)
);

export default router;