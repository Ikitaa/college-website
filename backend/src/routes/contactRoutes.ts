import { Router } from "express";
import {
  submitContactMessage,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage,
} from "../controllers/contactController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { formLimiter } from "../middleware/rateLimiters";
import { contactRules, handleValidation } from "../middleware/validators";

const router = Router();

router.post("/", formLimiter, contactRules, handleValidation, asyncHandler(submitContactMessage)); // public

router.get("/", protect, authorize("admin"), asyncHandler(getContactMessages));
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  asyncHandler(updateMessageStatus)
);
router.delete("/:id", protect, authorize("admin"), asyncHandler(deleteContactMessage));

export default router;