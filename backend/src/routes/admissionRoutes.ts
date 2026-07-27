import { Router } from "express";
import {
  submitAdmission,
  getAdmissions,
  updateAdmissionStatus,
  deleteAdmission,
} from "../controllers/admissionController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { formLimiter } from "../middleware/rateLimiters";
import { admissionRules, handleValidation } from "../middleware/validators";

const router = Router();

router.post("/", formLimiter, admissionRules, handleValidation, asyncHandler(submitAdmission)); // public

router.get("/", protect, authorize("admin"), asyncHandler(getAdmissions));
router.patch("/:id/status", protect, authorize("admin"), asyncHandler(updateAdmissionStatus));
router.delete("/:id", protect, authorize("admin"), asyncHandler(deleteAdmission));

export default router;