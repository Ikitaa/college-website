import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/siteSettingsController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getSettings)); // public
router.put("/", protect, authorize("admin"), asyncHandler(updateSettings));

export default router;