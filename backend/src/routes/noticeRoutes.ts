import { Router } from "express";
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController";
import { protect, authorize } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { noticeRules, handleValidation } from "../middleware/validators";

const router = Router();

router.get("/", asyncHandler(getNotices)); // public
router.get("/:id", asyncHandler(getNoticeById)); // public

router.post("/", protect, authorize("admin", "teacher"), noticeRules, handleValidation, asyncHandler(createNotice));
router.put("/:id", protect, authorize("admin", "teacher"), asyncHandler(updateNotice));
router.delete("/:id", protect, authorize("admin", "teacher"), asyncHandler(deleteNotice));

export default router;